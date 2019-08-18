const transformArray = (arr) => {
  return arr.map(item => [normalizeName(item.label), item]);
};

const normalizeName = (name) => {  
  if(typeof name !== 'string') {
    throw new Error('name is not a string');
  }

  return name
      .toLowerCase()
      // replace any accents 
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      // replace any spaces "/" "." ". "
      .replace(/(\. |-|\.| |\/)/g, '-');
};

module.exports = {
  getOffices: (name) => (name ? officesMap.get(normalizeName(name)) : offices),
  getStates: (name) => (name ? statesMap.get(normalizeName(name)) : states),
  normalizeName
};

const offices = [
  {"code": "23", "label": "Alicante/Alacant"},
  {"code": "221", "label": "Alicante/Alacant-Elche"},
  {"code": "24", "label": "Almeria"},
  {"code": "75", "label": "Araba/alava"},
  {"code": "32", "label": "Asturias-Gijon"},
  {"code": "26", "label": "Asturias-Oviedo"},
  {"code": "76", "label": "avila"},
  {"code": "77", "label": "Badajoz"},
  {"code": "27", "label": "Barcelona"},
  {"code": "63", "label": "Barcelona-Sabadell"},
  {"code": "28", "label": "Bizkaia"},
  {"code": "78", "label": "Burgos"},
  {"code": "80", "label": "Caceres"},
  {"code": "81", "label": "Cadiz"},
  {"code": "109", "label": "Cadiz-La Linea"},
  {"code": "101", "label": "Cantabria"},
  {"code": "102", "label": "Castellon/Castello"},
  {"code": "103", "label": "Ceuta"},
  {"code": "79", "label": "Ciudad Real"},
  {"code": "30", "label": "Cordoba"},
  {"code": "1", "label": "Coruña (A)"},
  {"code": "64", "label": "Coruña (A)-Santiago"},
  {"code": "104", "label": "Cuenca"},
  {"code": "105", "label": "Gipuzkoa"},
  {"code": "33", "label": "Girona"},
  {"code": "34", "label": "Granada"},
  {"code": "35", "label": "Guadalajara"},
  {"code": "106", "label": "Huelva"},
  {"code": "107", "label": "Huesca"},
  {"code": "36", "label": "Illes Balears-Ibiza"},
  {"code": "112", "label": "Illes Balears-Mallorca"},
  {"code": "116", "label": "Illes Balears-Menorca"},
  {"code": "108", "label": "Jaen"},
  {"code": "38", "label": "Las Palmas"},
  {"code": "31", "label": "Las Palmas-Fuerteventura"},
  {"code": "37", "label": "Las Palmas-Lanzarote"},
  {"code": "39", "label": "Leon"},
  {"code": "110", "label": "Lleida"},
  {"code": "111", "label": "Lugo"},
  {"code": "40", "label": "Madrid"},
  {"code": "74", "label": "Madrid-Alcala de Henares"},
  {"code": "2", "label": "Madrid-Alcorcon"},
  {"code": "41", "label": "Malaga"},
  {"code": "113", "label": "Melilla"},
  {"code": "61", "label": "Murcia"},
  {"code": "29", "label": "Murcia-Cartagena"},
  {"code": "117", "label": "Navarra"},
  {"code": "118", "label": "Ourense"},
  {"code": "119", "label": "Palencia"},
  {"code": "62", "label": "Pontevedra"},
  {"code": "70", "label": "Pontevedra-Vigo"},
  {"code": "115", "label": "Rioja (La)"},
  {"code": "120", "label": "S.C. de Tenerife"},
  {"code": "126", "label": "S.C. de Tenerife-La Palma"},
  {"code": "114", "label": "Salamanca"},
  {"code": "121", "label": "Segovia"},
  {"code": "65", "label": "Sevilla"},
  {"code": "122", "label": "Soria"},
  {"code": "67", "label": "Tarragona"},
  {"code": "123", "label": "Teruel"},
  {"code": "68", "label": "Toledo"},
  {"code": "66", "label": "Toledo-Talavera"},
  {"code": "69", "label": "Valencia/Valencia"},
  {"code": "25", "label": "Valencia/Valencia-Alzira"},
  {"code": "124", "label": "Valladolid"},
  {"code": "125", "label": "Zamora"},
  {"code": "71", "label": "Zaragoza"}
];

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

const officesMap = new Map(transformArray(offices));
const statesMap = new Map(transformArray(states));