const states = [
  { code: "2", label: "Albacete" },
  { code: "3", label: "Alicante/Alacant" },
  { code: "4", label: "Almeria" },
  { code: "1", label: "Araba/alava" },
  { code: "33", label: "Asturias" },
  { code: "5", label: "avila" },
  { code: "6", label: "Badajoz" },
  { code: "7", label: "Balears (Illes)" },
  { code: "8", label: "Barcelona" },
  { code: "48", label: "Bizkaia" },
  { code: "9", label: "Burgos" },
  { code: "10", label: "Caceres" },
  { code: "11", label: "Cadiz" },
  { code: "39", label: "Cantabria" },
  { code: "12", label: "Castellon/Castell&ograve;" },
  { code: "51", label: "Ceuta" },
  { code: "13", label: "Ciudad Real" },
  { code: "14", label: "Cordoba" },
  { code: "15", label: "Coruña (A)" },
  { code: "16", label: "Cuenca" },
  { code: "20", label: "Gipuzkoa" },
  { code: "17", label: "Girona" },
  { code: "18", label: "Granada" },
  { code: "19", label: "Guadalajara" },
  { code: "21", label: "Huelva" },
  { code: "22", label: "Huesca" },
  { code: "23", label: "Jae;n" },
  { code: "24", label: "Leon" },
  { code: "25", label: "Lleida" },
  { code: "27", label: "Lugo" },
  { code: "28", label: "Madrid" },
  { code: "29", label: "Malaga" },
  { code: "52", label: "Melilla" },
  { code: "30", label: "Murcia" },
  { code: "31", label: "Navarra" },
  { code: "32", label: "Ourense" },
  { code: "34", label: "Palencia" },
  { code: "35", label: "Palmas (Las)" },
  { code: "36", label: "Pontevedra" },
  { code: "26", label: "Rioja (La)" },
  { code: "37", label: "Salamanca" },
  { code: "38", label: "Santa Cruz de Tenerife" },
  { code: "40", label: "Segovia" },
  { code: "41", label: "Sevilla" },
  { code: "42", label: "Soria" },
  { code: "43", label: "Tarragona" },
  { code: "44", label: "Teruel" },
  { code: "45", label: "Toledo" },
  { code: "46", label: "Valencia/Valencia" },
  { code: "47", label: "Valladolid" },
  { code: "49", label: "Zamora" },
  { code: "50", label: "Zaragoza" }
];

const get = () => {
    return states.find(stateOb => normalizeName(stateOb.label) === normalizeName(name))
}

return {get};
