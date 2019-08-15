const {normalizeName} = require('@utils/helpers');

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

const get = (name) => {
  let result;
  
  if(name) {
    result = offices.find(office => normalizeName(office.label) === normalizeName(name));
  } else {
    result = offices;
  }

  return result;
};



module.exports = {
  get
}