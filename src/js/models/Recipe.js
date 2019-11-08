import axios from "axios";
import {
  key,
  proxy
} from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert("Something went wrong :(");
    }
  }
  calcTime() {
    //zakładając, że potrzebujemy 15 minut na każde 3 składniki
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    //zakladajac 4 porcje
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const units = [...unitsShort, "kg", "g"];

    const newIngredients = this.ingredients.map(el => {
      //1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      //2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      //3) Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
      let objIng;
      if (unitIndex > -1) {
        //There is a unit
        //Example: 4 1/2 cups, arrCount is [4, 1/2]
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+")); //eval i replace zamienia - na +
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+")); //eval("4 + 1/2") --> 4.5
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join("")
        };
      } else if (parseInt(arrIng[0], 10)) {
        //There is no unit, but 1st element is number, bierzemy pierwszy element z tablicy (moze byc string, tez zostanie zmieniony na liczbe, musi byc parametr 10) za pomoca parseInt konwertujemy na liczbe
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        //There is no unit an no number in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }
  //Aktualizacja liczby porcji i skladnikow
  updateServings(type) {
    //Servings - porcje
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1; // dodawanie i odejmowanie porcji

    //Ingredients - składniki
    this.ingredients.forEach(ing => {
      ing.count = ing.count * (newServings / this.servings);
    });
    this.servings = newServings;
  }
}