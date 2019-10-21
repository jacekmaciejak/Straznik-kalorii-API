import "./style.css";
import axios from "axios";

//c64731f496mshe51e815d217b33cp11abedjsn1edda6af55db
//"https://food-calorie-data-search.p.rapidapi.com/api/search"

async function getResults() {
  const proxy = "https://cors-anywhere.herokuapp.com/";
  const key = "c64731f496mshe51e815d217b33cp11abedjsn1edda6af55db";
  const res = await axios(
    `${proxy}https://food-calorie-data-search.p.rapidapi.com/api/search?key=${key}`
  );
  console.log(res);
}

getResults();
