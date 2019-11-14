import axios from "axios";
import { key, proxy } from "../config";

//-------------- 2 ----------------
export default class Search {
  constructor(query) {
    this.query = query;
  }
  //------------- 1 -------------------
  async getResault() {
    //try - catch, wyswietli blad jesli jest zle zapytanie
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
      ); //AXIOS-zamiast metody fetch, dziala na wszystkich przegladarkach, musimy ja zainstalowac, sluzy do pobierania danych, jako parametr dajemy adres API URL, oddzielamy "?" i dodajemy kolejne parametry
      this.result = res.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}
