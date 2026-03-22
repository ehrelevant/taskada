#!/usr/bin/env python3
"""Build release APKs for seeker-app and provider-app."""

import os
import re
import shutil
import subprocess
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parent
RELEASES_DIR = ROOT_DIR / "releases"

APPS = [
    {"name": "seeker-app", "apk_name": "taskada-seeker.apk"},
    {"name": "provider-app", "apk_name": "taskada-provider.apk"},
]


def load_env_build():
    """Load signing secrets from scripts/.env.build."""
    env_file = SCRIPT_DIR / ".env.build"
    env = {}
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                env[key.strip()] = value.strip().strip('"').strip("'")
    else:
        print(f"WARNING: {env_file} not found. Using defaults.")

    env.setdefault("TASKADA_KEYSTORE_PASSWORD", "taskada2026")
    env.setdefault("TASKADA_KEY_ALIAS", "taskada-release")
    env.setdefault("TASKADA_VALIDITY_DAYS", "10000")
    return env


def generate_keystore(keystore_path, key_alias, password, validity_days):
    """Generate a signing keystore if it doesn't exist."""
    if keystore_path.exists():
        print(f"Keystore already exists at {keystore_path}, skipping generation.")
        return

    print(f"Generating signing keystore at {keystore_path}...")
    subprocess.run(
        [
            "keytool",
            "-genkeypair",
            "-v",
            "-storetype",
            "PKCS12",
            "-keystore",
            str(keystore_path),
            "-alias",
            key_alias,
            "-keyalg",
            "RSA",
            "-keysize",
            "2048",
            "-validity",
            str(validity_days),
            "-storepass",
            password,
            "-keypass",
            password,
            "-dname",
            "CN=Taskada, OU=Taskada, O=Taskada, L=Unknown, ST=Unknown, C=US",
        ],
        check=True,
    )


def update_gradle_properties(gradle_props_path, key_alias, password):
    """Update gradle.properties with release signing credentials."""
    content = gradle_props_path.read_text()

    # Remove existing TASKADA_ lines
    lines = [
        line
        for line in content.splitlines()
        if not any(
            line.startswith(prefix)
            for prefix in [
                "TASKADA_UPLOAD_STORE_FILE",
                "TASKADA_UPLOAD_KEY_ALIAS",
                "TASKADA_UPLOAD_STORE_PASSWORD",
                "TASKADA_UPLOAD_KEY_PASSWORD",
            ]
        )
    ]

    # Append new signing config
    lines.extend(
        [
            "",
            "# Release signing config",
            "TASKADA_UPLOAD_STORE_FILE=taskada-release.keystore",
            f"TASKADA_UPLOAD_KEY_ALIAS={key_alias}",
            f"TASKADA_UPLOAD_STORE_PASSWORD={password}",
            f"TASKADA_UPLOAD_KEY_PASSWORD={password}",
        ]
    )

    gradle_props_path.write_text("\n".join(lines) + "\n")


def update_build_gradle(build_gradle_path):
    """Update build.gradle with release signing config."""
    content = build_gradle_path.read_text()

    release_signing = """        release {
            if (project.hasProperty('TASKADA_UPLOAD_STORE_FILE')) {
                storeFile file(project.property('TASKADA_UPLOAD_STORE_FILE'))
                storePassword project.property('TASKADA_UPLOAD_STORE_PASSWORD')
                keyAlias project.property('TASKADA_UPLOAD_KEY_ALIAS')
                keyPassword project.property('TASKADA_UPLOAD_KEY_PASSWORD')
            }
        }"""

    # Insert release signing config before the closing brace of signingConfigs
    content = re.sub(
        r"(signingConfigs \{[^}]*debug \{[^}]*\}[^}]*\})",
        lambda m: m.group(1).rstrip() + "\n" + release_signing + "\n    }",
        content,
        flags=re.DOTALL,
    )

    # Update release build type to use release signing config
    content = re.sub(
        r"(release \{[^}]*?)signingConfig signingConfigs\.debug",
        r"\1signingConfig signingConfigs.release",
        content,
        count=1,
        flags=re.DOTALL,
    )

    build_gradle_path.write_text(content)


def build_app(app, signing_config):
    """Build a single app's release APK."""
    app_name = app["name"]
    apk_name = app["apk_name"]
    app_dir = ROOT_DIR / "apps" / app_name
    android_dir = app_dir / "android"
    keystore_file = android_dir / "app" / "taskada-release.keystore"
    gradlew = android_dir / "gradlew"
    gradle_props = android_dir / "gradle.properties"
    build_gradle = android_dir / "app" / "build.gradle"

    print(f"\n{'=' * 50}")
    print(f"Building {app_name}")
    print(f"{'=' * 50}")

    # Check for .env.production
    env_prod = app_dir / ".env.production"
    if not env_prod.exists():
        print(f"WARNING: {env_prod} not found. Falling back to .env")

    # 1. Generate native android project if missing
    if not android_dir.exists():
        print(f"Running expo prebuild for {app_name}...")
        subprocess.run(
            ["npx", "expo", "prebuild", "--platform", "android", "--no-install"],
            cwd=app_dir,
            check=True,
        )

    # 2. Generate signing keystore
    generate_keystore(
        keystore_file,
        signing_config["key_alias"],
        signing_config["password"],
        signing_config["validity_days"],
    )

    # 3. Update gradle.properties
    print("Updating gradle.properties...")
    update_gradle_properties(
        gradle_props,
        signing_config["key_alias"],
        signing_config["password"],
    )

    # 4. Update build.gradle
    print("Updating build.gradle...")
    update_build_gradle(build_gradle)

    # 5. Clean the project
    print(f"Cleaning {app_name}...")
    subprocess.run([str(gradlew), "clean"], cwd=android_dir, check=True)

    # 6. Build release APK with NODE_ENV=production
    print(f"Building release APK for {app_name}...")
    env = {**os.environ, "NODE_ENV": "production"}
    subprocess.run(
        [str(gradlew), "assembleRelease"],
        cwd=android_dir,
        check=True,
        env=env,
    )

    # 7. Copy APK to releases/
    apk_path = (
        android_dir
        / "app"
        / "build"
        / "outputs"
        / "apk"
        / "release"
        / "app-release.apk"
    )
    if apk_path.exists():
        dest = RELEASES_DIR / apk_name
        shutil.copy(apk_path, dest)
        print(f"Copied {apk_name} to {RELEASES_DIR}/")
    else:
        raise FileNotFoundError(f"APK not found at {apk_path}")

    print(f"=== Done building {app_name} ===")


def main():
    """Main entry point."""
    print("Taskada APK Builder")
    print(f"Root: {ROOT_DIR}")
    print(f"Output: {RELEASES_DIR}")

    # Load signing config
    env_config = load_env_build()
    signing_config = {
        "password": env_config["TASKADA_KEYSTORE_PASSWORD"],
        "key_alias": env_config["TASKADA_KEY_ALIAS"],
        "validity_days": int(env_config["TASKADA_VALIDITY_DAYS"]),
    }

    # Create releases directory
    RELEASES_DIR.mkdir(exist_ok=True)

    # Build all apps
    for app in APPS:
        build_app(app, signing_config)

    # Summary
    print(f"\n{'=' * 50}")
    print("All APKs built successfully!")
    print(f"{'=' * 50}")
    for apk in sorted(RELEASES_DIR.iterdir()):
        size_mb = apk.stat().st_size / (1024 * 1024)
        print(f"  {apk.name}: {size_mb:.1f} MB")


if __name__ == "__main__":
    main()
