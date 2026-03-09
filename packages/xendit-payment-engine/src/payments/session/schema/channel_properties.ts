import * as v from 'valibot';

const optional_string = v.optional(v.string());
const payer_name_only = v.object({ payer_name: optional_string });

const recurring_configuration = v.optional(
  v.object({
    recurring_expiry: optional_string,
    ecurring_frequency: optional_string,
  }),
);

const CardsSaveSchema = v.object({
  card_on_file_type: optional_string,
  statement_descriptor: optional_string,
  recurring_configuration: recurring_configuration,
  allowed_bins: optional_string,
  show_installment_options: optional_string,
});

const CardsPaySchema = v.object({
  mid_label: optional_string,
  skip_three_ds: optional_string,
  card_on_file_type: optional_string,
  statement_descriptor: optional_string,
  recurring_configuration: recurring_configuration,
  allowed_bins: optional_string,
  show_installment_options: optional_string,
});

const UsscPaySchema = payer_name_only;
const SevenElevenPaySchema = payer_name_only;
const SevenElevenCliqqPaySchema = payer_name_only;
const PalawanPaySchema = payer_name_only;
const EcpayDragonloanPaySchema = payer_name_only;
const RobinsonsBillsPaymentPaySchema = payer_name_only;
const LbcPaySchema = payer_name_only;
const MlhuillierPaySchema = payer_name_only;
const CebuanaPaySchema = payer_name_only;
const EcpaySchoolPaySchema = payer_name_only;
const EcpayPaySchema = payer_name_only;

const ChannelPropertiesPaySchema = v.union([
  CardsPaySchema,
  UsscPaySchema,
  SevenElevenPaySchema,
  SevenElevenCliqqPaySchema,
  PalawanPaySchema,
  EcpayDragonloanPaySchema,
  RobinsonsBillsPaymentPaySchema,
  LbcPaySchema,
  MlhuillierPaySchema,
  CebuanaPaySchema,
  EcpaySchoolPaySchema,
  EcpayPaySchema,
]);

const ChannelPropertiesSaveSchema = v.union([CardsSaveSchema]);

export { ChannelPropertiesPaySchema, ChannelPropertiesSaveSchema };
