export interface PhoneCountry {
  name: string;
  dialCode: string;
  flag: string;
}

// Lista mundial de códigos de país (E.164). Angola aparece primeiro porque é o
// mercado principal; os restantes seguem por ordem alfabética.
export const PHONE_COUNTRIES: PhoneCountry[] = [
  { name: "Angola", dialCode: "+244", flag: "🇦🇴" },
  { name: "Afeganistão", dialCode: "+93", flag: "🇦🇫" },
  { name: "África do Sul", dialCode: "+27", flag: "🇿🇦" },
  { name: "Albânia", dialCode: "+355", flag: "🇦🇱" },
  { name: "Alemanha", dialCode: "+49", flag: "🇩🇪" },
  { name: "Andorra", dialCode: "+376", flag: "🇦🇩" },
  { name: "Arábia Saudita", dialCode: "+966", flag: "🇸🇦" },
  { name: "Argélia", dialCode: "+213", flag: "🇩🇿" },
  { name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { name: "Arménia", dialCode: "+374", flag: "🇦🇲" },
  { name: "Austrália", dialCode: "+61", flag: "🇦🇺" },
  { name: "Áustria", dialCode: "+43", flag: "🇦🇹" },
  { name: "Azerbaijão", dialCode: "+994", flag: "🇦🇿" },
  { name: "Bahamas", dialCode: "+1-242", flag: "🇧🇸" },
  { name: "Bahrein", dialCode: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", dialCode: "+880", flag: "🇧🇩" },
  { name: "Barbados", dialCode: "+1-246", flag: "🇧🇧" },
  { name: "Bélgica", dialCode: "+32", flag: "🇧🇪" },
  { name: "Belize", dialCode: "+501", flag: "🇧🇿" },
  { name: "Benim", dialCode: "+229", flag: "🇧🇯" },
  { name: "Bielorrússia", dialCode: "+375", flag: "🇧🇾" },
  { name: "Bolívia", dialCode: "+591", flag: "🇧🇴" },
  { name: "Bósnia e Herzegovina", dialCode: "+387", flag: "🇧🇦" },
  { name: "Botsuana", dialCode: "+267", flag: "🇧🇼" },
  { name: "Brasil", dialCode: "+55", flag: "🇧🇷" },
  { name: "Brunei", dialCode: "+673", flag: "🇧🇳" },
  { name: "Bulgária", dialCode: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", dialCode: "+226", flag: "🇧🇫" },
  { name: "Burundi", dialCode: "+257", flag: "🇧🇮" },
  { name: "Butão", dialCode: "+975", flag: "🇧🇹" },
  { name: "Cabo Verde", dialCode: "+238", flag: "🇨🇻" },
  { name: "Camarões", dialCode: "+237", flag: "🇨🇲" },
  { name: "Camboja", dialCode: "+855", flag: "🇰🇭" },
  { name: "Canadá", dialCode: "+1", flag: "🇨🇦" },
  { name: "Catar", dialCode: "+974", flag: "🇶🇦" },
  { name: "Cazaquistão", dialCode: "+7", flag: "🇰🇿" },
  { name: "Chade", dialCode: "+235", flag: "🇹🇩" },
  { name: "Chile", dialCode: "+56", flag: "🇨🇱" },
  { name: "China", dialCode: "+86", flag: "🇨🇳" },
  { name: "Chipre", dialCode: "+357", flag: "🇨🇾" },
  { name: "Colômbia", dialCode: "+57", flag: "🇨🇴" },
  { name: "Comores", dialCode: "+269", flag: "🇰🇲" },
  { name: "Congo-Brazzaville", dialCode: "+242", flag: "🇨🇬" },
  { name: "Congo-Kinshasa", dialCode: "+243", flag: "🇨🇩" },
  { name: "Coreia do Norte", dialCode: "+850", flag: "🇰🇵" },
  { name: "Coreia do Sul", dialCode: "+82", flag: "🇰🇷" },
  { name: "Costa do Marfim", dialCode: "+225", flag: "🇨🇮" },
  { name: "Costa Rica", dialCode: "+506", flag: "🇨🇷" },
  { name: "Croácia", dialCode: "+385", flag: "🇭🇷" },
  { name: "Cuba", dialCode: "+53", flag: "🇨🇺" },
  { name: "Dinamarca", dialCode: "+45", flag: "🇩🇰" },
  { name: "Djibuti", dialCode: "+253", flag: "🇩🇯" },
  { name: "Dominica", dialCode: "+1-767", flag: "🇩🇲" },
  { name: "Egito", dialCode: "+20", flag: "🇪🇬" },
  { name: "El Salvador", dialCode: "+503", flag: "🇸🇻" },
  { name: "Emirados Árabes Unidos", dialCode: "+971", flag: "🇦🇪" },
  { name: "Equador", dialCode: "+593", flag: "🇪🇨" },
  { name: "Eritreia", dialCode: "+291", flag: "🇪🇷" },
  { name: "Eslováquia", dialCode: "+421", flag: "🇸🇰" },
  { name: "Eslovénia", dialCode: "+386", flag: "🇸🇮" },
  { name: "Espanha", dialCode: "+34", flag: "🇪🇸" },
  { name: "Estados Unidos", dialCode: "+1", flag: "🇺🇸" },
  { name: "Estónia", dialCode: "+372", flag: "🇪🇪" },
  { name: "Eswatini", dialCode: "+268", flag: "🇸🇿" },
  { name: "Etiópia", dialCode: "+251", flag: "🇪🇹" },
  { name: "Fiji", dialCode: "+679", flag: "🇫🇯" },
  { name: "Filipinas", dialCode: "+63", flag: "🇵🇭" },
  { name: "Finlândia", dialCode: "+358", flag: "🇫🇮" },
  { name: "França", dialCode: "+33", flag: "🇫🇷" },
  { name: "Gabão", dialCode: "+241", flag: "🇬🇦" },
  { name: "Gâmbia", dialCode: "+220", flag: "🇬🇲" },
  { name: "Gana", dialCode: "+233", flag: "🇬🇭" },
  { name: "Geórgia", dialCode: "+995", flag: "🇬🇪" },
  { name: "Grécia", dialCode: "+30", flag: "🇬🇷" },
  { name: "Granada", dialCode: "+1-473", flag: "🇬🇩" },
  { name: "Guatemala", dialCode: "+502", flag: "🇬🇹" },
  { name: "Guiana", dialCode: "+592", flag: "🇬🇾" },
  { name: "Guiné", dialCode: "+224", flag: "🇬🇳" },
  { name: "Guiné-Bissau", dialCode: "+245", flag: "🇬🇼" },
  { name: "Guiné Equatorial", dialCode: "+240", flag: "🇬🇶" },
  { name: "Haiti", dialCode: "+509", flag: "🇭🇹" },
  { name: "Honduras", dialCode: "+504", flag: "🇭🇳" },
  { name: "Hungria", dialCode: "+36", flag: "🇭🇺" },
  { name: "Iémen", dialCode: "+967", flag: "🇾🇪" },
  { name: "Índia", dialCode: "+91", flag: "🇮🇳" },
  { name: "Indonésia", dialCode: "+62", flag: "🇮🇩" },
  { name: "Irão", dialCode: "+98", flag: "🇮🇷" },
  { name: "Iraque", dialCode: "+964", flag: "🇮🇶" },
  { name: "Irlanda", dialCode: "+353", flag: "🇮🇪" },
  { name: "Islândia", dialCode: "+354", flag: "🇮🇸" },
  { name: "Israel", dialCode: "+972", flag: "🇮🇱" },
  { name: "Itália", dialCode: "+39", flag: "🇮🇹" },
  { name: "Jamaica", dialCode: "+1-876", flag: "🇯🇲" },
  { name: "Japão", dialCode: "+81", flag: "🇯🇵" },
  { name: "Jordânia", dialCode: "+962", flag: "🇯🇴" },
  { name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
  { name: "Laos", dialCode: "+856", flag: "🇱🇦" },
  { name: "Lesoto", dialCode: "+266", flag: "🇱🇸" },
  { name: "Letónia", dialCode: "+371", flag: "🇱🇻" },
  { name: "Líbano", dialCode: "+961", flag: "🇱🇧" },
  { name: "Libéria", dialCode: "+231", flag: "🇱🇷" },
  { name: "Líbia", dialCode: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", dialCode: "+423", flag: "🇱🇮" },
  { name: "Lituânia", dialCode: "+370", flag: "🇱🇹" },
  { name: "Luxemburgo", dialCode: "+352", flag: "🇱🇺" },
  { name: "Macau", dialCode: "+853", flag: "🇲🇴" },
  { name: "Macedónia do Norte", dialCode: "+389", flag: "🇲🇰" },
  { name: "Madagáscar", dialCode: "+261", flag: "🇲🇬" },
  { name: "Malásia", dialCode: "+60", flag: "🇲🇾" },
  { name: "Maláui", dialCode: "+265", flag: "🇲🇼" },
  { name: "Maldivas", dialCode: "+960", flag: "🇲🇻" },
  { name: "Mali", dialCode: "+223", flag: "🇲🇱" },
  { name: "Malta", dialCode: "+356", flag: "🇲🇹" },
  { name: "Marrocos", dialCode: "+212", flag: "🇲🇦" },
  { name: "Maurícia", dialCode: "+230", flag: "🇲🇺" },
  { name: "Mauritânia", dialCode: "+222", flag: "🇲🇷" },
  { name: "México", dialCode: "+52", flag: "🇲🇽" },
  { name: "Mianmar", dialCode: "+95", flag: "🇲🇲" },
  { name: "Moçambique", dialCode: "+258", flag: "🇲🇿" },
  { name: "Moldávia", dialCode: "+373", flag: "🇲🇩" },
  { name: "Mónaco", dialCode: "+377", flag: "🇲🇨" },
  { name: "Mongólia", dialCode: "+976", flag: "🇲🇳" },
  { name: "Montenegro", dialCode: "+382", flag: "🇲🇪" },
  { name: "Namíbia", dialCode: "+264", flag: "🇳🇦" },
  { name: "Nepal", dialCode: "+977", flag: "🇳🇵" },
  { name: "Nicarágua", dialCode: "+505", flag: "🇳🇮" },
  { name: "Níger", dialCode: "+227", flag: "🇳🇪" },
  { name: "Nigéria", dialCode: "+234", flag: "🇳🇬" },
  { name: "Noruega", dialCode: "+47", flag: "🇳🇴" },
  { name: "Nova Zelândia", dialCode: "+64", flag: "🇳🇿" },
  { name: "Omã", dialCode: "+968", flag: "🇴🇲" },
  { name: "Países Baixos", dialCode: "+31", flag: "🇳🇱" },
  { name: "Palestina", dialCode: "+970", flag: "🇵🇸" },
  { name: "Panamá", dialCode: "+507", flag: "🇵🇦" },
  { name: "Papua-Nova Guiné", dialCode: "+675", flag: "🇵🇬" },
  { name: "Paquistão", dialCode: "+92", flag: "🇵🇰" },
  { name: "Paraguai", dialCode: "+595", flag: "🇵🇾" },
  { name: "Peru", dialCode: "+51", flag: "🇵🇪" },
  { name: "Polónia", dialCode: "+48", flag: "🇵🇱" },
  { name: "Porto Rico", dialCode: "+1-787", flag: "🇵🇷" },
  { name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { name: "Quénia", dialCode: "+254", flag: "🇰🇪" },
  { name: "Quirguistão", dialCode: "+996", flag: "🇰🇬" },
  { name: "Reino Unido", dialCode: "+44", flag: "🇬🇧" },
  { name: "República Centro-Africana", dialCode: "+236", flag: "🇨🇫" },
  { name: "República Checa", dialCode: "+420", flag: "🇨🇿" },
  { name: "República Dominicana", dialCode: "+1-809", flag: "🇩🇴" },
  { name: "Roménia", dialCode: "+40", flag: "🇷🇴" },
  { name: "Ruanda", dialCode: "+250", flag: "🇷🇼" },
  { name: "Rússia", dialCode: "+7", flag: "🇷🇺" },
  { name: "Samoa", dialCode: "+685", flag: "🇼🇸" },
  { name: "São Tomé e Príncipe", dialCode: "+239", flag: "🇸🇹" },
  { name: "Senegal", dialCode: "+221", flag: "🇸🇳" },
  { name: "Serra Leoa", dialCode: "+232", flag: "🇸🇱" },
  { name: "Sérvia", dialCode: "+381", flag: "🇷🇸" },
  { name: "Seychelles", dialCode: "+248", flag: "🇸🇨" },
  { name: "Singapura", dialCode: "+65", flag: "🇸🇬" },
  { name: "Síria", dialCode: "+963", flag: "🇸🇾" },
  { name: "Somália", dialCode: "+252", flag: "🇸🇴" },
  { name: "Sri Lanka", dialCode: "+94", flag: "🇱🇰" },
  { name: "Suazilândia", dialCode: "+268", flag: "🇸🇿" },
  { name: "Sudão", dialCode: "+249", flag: "🇸🇩" },
  { name: "Sudão do Sul", dialCode: "+211", flag: "🇸🇸" },
  { name: "Suécia", dialCode: "+46", flag: "🇸🇪" },
  { name: "Suíça", dialCode: "+41", flag: "🇨🇭" },
  { name: "Suriname", dialCode: "+597", flag: "🇸🇷" },
  { name: "Tailândia", dialCode: "+66", flag: "🇹🇭" },
  { name: "Taiwan", dialCode: "+886", flag: "🇹🇼" },
  { name: "Tanzânia", dialCode: "+255", flag: "🇹🇿" },
  { name: "Timor-Leste", dialCode: "+670", flag: "🇹🇱" },
  { name: "Togo", dialCode: "+228", flag: "🇹🇬" },
  { name: "Trindade e Tobago", dialCode: "+1-868", flag: "🇹🇹" },
  { name: "Tunísia", dialCode: "+216", flag: "🇹🇳" },
  { name: "Turquemenistão", dialCode: "+993", flag: "🇹🇲" },
  { name: "Turquia", dialCode: "+90", flag: "🇹🇷" },
  { name: "Ucrânia", dialCode: "+380", flag: "🇺🇦" },
  { name: "Uganda", dialCode: "+256", flag: "🇺🇬" },
  { name: "Uruguai", dialCode: "+598", flag: "🇺🇾" },
  { name: "Uzbequistão", dialCode: "+998", flag: "🇺🇿" },
  { name: "Vaticano", dialCode: "+379", flag: "🇻🇦" },
  { name: "Venezuela", dialCode: "+58", flag: "🇻🇪" },
  { name: "Vietname", dialCode: "+84", flag: "🇻🇳" },
  { name: "Zâmbia", dialCode: "+260", flag: "🇿🇲" },
  { name: "Zimbábue", dialCode: "+263", flag: "🇿🇼" },
];

// Formato nacional por código de país (E.164). `#` = dígito, o resto são
// separadores literais. Países sem formato entram apenas com dígitos.
export const NATIONAL_PHONE_FORMATS: Record<string, string> = {
  "+244": "###-###-###", // Angola
  "+258": "## ### ####", // Moçambique
  "+351": "### ### ###", // Portugal
  "+55": "(##) #####-####", // Brasil
  "+238": "### ####", // Cabo Verde
  "+239": "### ####", // São Tomé e Príncipe
  "+245": "### ####", // Guiné-Bissau
  "+670": "### ####", // Timor-Leste
  "+1": "(###) ###-####", // EUA, Canadá
  "+44": "#### ### ###", // Reino Unido
  "+34": "### ### ###", // Espanha
  "+33": "## ## ## ## ##", // França
  "+39": "### ### ####", // Itália
  "+86": "### #### ####", // China
  "+91": "#### ### ###", // Índia
  "+234": "### ### ####", // Nigéria
  "+27": "## ### ####", // África do Sul
  "+52": "## #### ####", // México
  "+57": "### ### ####", // Colômbia
  "+56": "# #### ####", // Chile
  "+51": "### ### ###", // Peru
  "+7": "### ###-##-##", // Rússia, Cazaquistão
  "+90": "### ### ####", // Turquia
  "+31": "## ### ####", // Países Baixos
  "+32": "### ### ###", // Bélgica
  "+61": "### ### ###", // Austrália
  "+47": "## ## ## ##", // Noruega
  "+45": "## ## ## ##", // Dinamarca
  "+48": "### ### ###", // Polónia
  "+359": "### ### ###", // Bulgária
  "+254": "### ### ###", // Quénia
  "+255": "### ### ###", // Tanzânia
  "+256": "### ### ###", // Uganda
  "+233": "### ### ###", // Gana
  "+221": "## ### ## ##", // Senegal
  "+243": "### ### ###", // Congo-Kinshasa
  "+260": "### ### ###", // Zâmbia
  "+251": "### ### ###", // Etiópia
  "+250": "### ### ###", // Ruanda
};

export function formatPhoneNumber(value: string, dialCode?: string): string {
  const format = dialCode ? NATIONAL_PHONE_FORMATS[dialCode] : undefined;
  let digits = value.replace(/\D/g, "");
  if (dialCode) {
    const codeDigits = dialCode.replace(/\D/g, "");
    if (codeDigits && digits.startsWith(codeDigits))
      digits = digits.slice(codeDigits.length);
  }
  if (!format) return digits.slice(0, 15);

  let out = "";
  let d = 0;
  for (const ch of format) {
    if (d >= digits.length) break;
    out += ch === "#" ? digits[d++] : ch;
  }
  return out;
}

export function getPhoneNumberInfo(dialCode: string) {
  const format = NATIONAL_PHONE_FORMATS[dialCode];
  if (!format) return null;
  return { expectedDigits: (format.match(/#/g) ?? []).length, format };
}

export interface PhoneNumberValidation {
  ok: boolean;
  message?: string;
}

export function validatePhoneNumber(
  digits: string,
  dialCode: string,
): PhoneNumberValidation {
  const info = getPhoneNumberInfo(dialCode);
  if (!info) return { ok: digits.length >= 4 };
  const expected = info.expectedDigits;
  return digits.length === expected
    ? { ok: true }
    : { ok: false, message: `O número deve ter ${expected} dígitos.` };
}

export function parseFullPhone(full: string): {
  dialCode: string;
  digits: string;
} {
  const [dialCode = "", ...rest] = full.trim().split(" ");
  return { dialCode, digits: rest.join("").replace(/\D/g, "") };
}
