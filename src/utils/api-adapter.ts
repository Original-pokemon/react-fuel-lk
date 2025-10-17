/**
 * Mapping of Russian field names to English equivalents
 */
const fieldMappings: Record<string, string> = {
  // Common fields
  firmid: 'firmId',
  dt: 'date',

  // Firm fields
  Наименование: 'name',
  Заблокирована: 'blocked',
  Безлимитная: 'unlimited',
  НачалоПериодаДатаДоговоров: 'contractPeriodStart',
  ОкончаниеПериодаДоговоров: 'contractPeriodEnd',
  ТипыЦен: 'priceTypes',
  ТипыЦенСтрокой: 'priceTypesString',
  Договора: 'contracts',
  ОперативныйОвердрафтИнфо: 'overdraftInfo',
  ТекущиеЗаправки: 'currentRefuels',
  ВиртуальнаяКартаКонтрагента: 'virtualCard',
  ВиртуальныйСчетРубли: 'virtualAccountRubles',
  СпецКарты: 'specialCards',
  Карты: 'cards',
  ОстатокКартаТопливоОбъем_П_Х: 'cardFuelVolumeRemain',
  ОстатокТопливоОбъем_П_Х: 'fuelVolumeRemain',
  ПерерасходКартаТопливоОбъем_М: 'cardFuelVolumeOverdraft',
  ПерерасходТопливоОбъем_М: 'fuelVolumeOverdraft',

  // Card fields
  КартаНомер: 'cardNumber',
  КартаВладелец: 'cardOwner',
  ТипКошелька: 'walletType',
  ЛимитДень: 'dayLimit',
  ОстатокДень: 'dayRemain',
  ЛимитМесяц: 'monthLimit',
  ОстатокМесяц: 'monthRemain',
  Кошельки: 'wallets',

  // Contract fields
  ДоговорНачалоДействия: 'contractStartDate',
  ДоговорОкончаниеДействия: 'contractEndDate',
  ДоговорНомер: 'contractNumber',
  ДоговорКомментарий: 'contractComment',
  ТипЦен: 'priceType',
  ТипЦенСтрока: 'priceTypeString',
  СкидкаНаЦенуМножитель: 'discountMultiplier',
  ПерсЦенаТоплива: 'personalFuelPrices',
  ПерсСкидкаНаЦенуТоплива: 'personalFuelDiscounts',
  СуммаИсходная: 'initialAmount',
  СуммаКонтролируемая_Х: 'controlledAmount',
  ГлубинаКредитаРуб_Х: 'creditDepthRubles',
  ОтсрочкаПлатежаДней: 'paymentDeferralDays',
  ОплатаСуммы_П: 'paymentAmount',
  РасходСуммыДо_М: 'amountSpentBefore',
  РасходСуммыОпер_М: 'operationalAmountSpent',
  РасходСуммы_М: 'totalAmountSpent',
  БалансОплатыСуммыДо: 'paymentBalanceBefore',
  БалансОплатыСуммыДо_П: 'paymentBalanceBeforeWithCredit',
  БалансОплатыСуммыДо_М: 'paymentBalanceBeforeOperational',
  БалансОплатыСуммы: 'paymentBalance',
  БалансОплатыСуммы_П: 'paymentBalanceWithCredit',
  БалансОплатыСуммы_М: 'paymentBalanceOperational',
  БалансОплатыСКредитомРуб_X: 'paymentBalanceWithCreditRubles',
  БалансОплатыСКредитомРуб_П_X: 'paymentBalanceWithCreditRublesWithCredit',
  БалансОплатыСКредитомРуб_М: 'paymentBalanceWithCreditRublesOperational',
  ОстатокСуммыДо_Х: 'amountRemainBefore',
  ОстатокСуммы_Х: 'amountRemain',
  ОстатокСуммы_П_Х: 'amountRemainWithCredit',
  ОстатокСуммы_М: 'amountRemainOperational',
  МожемПотратитьРубДог_П_Х: 'canSpendRublesContractWithCredit',
  ПерерасходРубДог_М: 'overdraftRublesContract',
  МожемПотратитьРубТЧ_П_Х: 'canSpendRublesTechWithCredit',
  ПерерасходРубТЧ_М: 'overdraftRublesTech',
  МожемПотратитьРуб_П_Х: 'canSpendRublesWithCredit',
  ВиртуальныйСчетДоговораРуб: 'virtualContractAccountRubles',
  ПерерасходРуб_М: 'overdraftRubles',
  ЦеныСчетаМакс: 'accountMaxPrices',
  Балансы: 'balances',

  // Fueling fields
  ЦенаДляКлиента: 'priceForClient',
  ЗалилиЛитров: 'litersFilled',
  ОсталосьЗалитьЛитров: 'litersRemaining',

  // Current refueling fields
  isbefore: 'isBefore',
  isspecial: 'isSpecial',
  cardnum: 'cardNumber',
  azs: 'stationId',
  fuelid: 'fuelId',
  azsprice: 'stationPrice',
  needtofill: 'needToFill',
  fuelings: 'fuelings',
  overdraft: 'overdraft',

  // Balance fields (same as in contract, so omitted to avoid duplicates)
};

/**
 * Recursively transforms object keys from Russian to English using fieldMappings
 */
function transformKeys(object: any): any {
  if (object === null || typeof object !== 'object') {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(transformKeys);
  }

  const transformed: any = {};

  for (const [key, value] of Object.entries(object)) {
    const englishKey = fieldMappings[key] || key;
    transformed[englishKey] = transformKeys(value);
  }

  return transformed;
}

/**
 * Adapter function to convert API response from Russian field names to English
 */
export function adaptApiResponse<T>(data: T): T {
  return transformKeys(data);
}
