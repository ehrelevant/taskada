import * as z from 'zod';

const optional_string = z.string().optional();
const payer_name_only = z
  .object({ payer_name: optional_string })
  .meta({ description: 'Payer name only', example: [{ payer_name: 'Alice' }] });

const recurring_configuration = z
  .object({
    recurring_expiry: optional_string,
    ecurring_frequency: optional_string,
  })
  .optional();

const CardsSaveSchema = z
  .object({
    card_on_file_type: optional_string,
    statement_descriptor: optional_string,
    recurring_configuration: recurring_configuration,
    allowed_bins: optional_string,
    show_installment_options: optional_string,
  })
  .meta({ description: 'Card save properties', example: [{ card_on_file_type: 'ON_FILE' }] });

const CardsPaySchema = z
  .object({
    mid_label: optional_string,
    skip_three_ds: optional_string,
    card_on_file_type: optional_string,
    statement_descriptor: optional_string,
    recurring_configuration: recurring_configuration,
    allowed_bins: optional_string,
    show_installment_options: optional_string,
  })
  .meta({ description: 'Card pay properties', example: [{ mid_label: 'MID' }] });

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

const ChannelPropertiesPaySchema = z.union([
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

const ChannelPropertiesSaveSchema = z.union([CardsSaveSchema]);

export { ChannelPropertiesPaySchema, ChannelPropertiesSaveSchema };
