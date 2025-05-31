<template>
    <div class="container" style="margin-left: 40px;">
      <h1>Создайте свой рецепт</h1>
  
      <!-- Название рецепта -->
      <h2 class="heading">Введите название вашего рецепта</h2>
      <div style="width: 40%; height: 80px;" class="title">
        <my-input 
        v-model="recipe.title" 
        class="input" 
        :disableScale="true"
        placeholder="Название рецепта"
        />
      </div>
  
      <!-- Загрузка изображения -->
      <h2 class="heading">Добавьте фото</h2>
      <div class="recipe-image">
        <img :src="recipe.imagePreview || placeholderImage" alt="Фото блюда" class="img shadow" />
        <label class="file-label shadow">
          <input type="file" @change="uploadImage" class="file-input" />
          <span style="font-size: 1.1rem;">📷 Загрузить фото</span>
        </label>
      </div>
  
      <!-- Описание -->
      <h2>Опишите свой рецепт</h2>
      <textarea v-model="recipe.description" class="textarea shadow" type="textarea"></textarea>
  
      <!-- Тэги -->
      <div ref="tagsWrapper" class="tags shadow">
        <h2 class="theading">Какие тэги подходят вашему рецепту?</h2>
  
        <my-input
          ref="tagInput"
          v-model="searchTag"
          class="tinput"
          :disableScale="true"
          placeholder="Найти"
          @focus="onTagInputFocus"
        />
  
        <!-- Результаты поиска тэгов-->
        <div v-if="showTagsSearchResults" ref="searchResults" class="search-results">
          <ul v-if="filteredTags.length">
            <li
              v-for="tag in filteredTags"
              :key="tag.id"
              class="tag-item"
              @click="addTag(tag)"
            >
              {{ tag.title }}
            </li>
          </ul>
          <p v-else v-show="token"><button @click="CreateTag">Добавить тэг</button></p>
          <p v-show="!token">Ничего не найдено</p>

        </div>
  
        <!-- Выбранные тэги -->
        <div class="selected-tags" v-if="recipe.tags.length">
          <h3>Выбранные тэги:</h3>
          <ul>
            <li v-for="tag in recipe.tags" :key="tag.id" class="selected-tag">
              {{ tag.title }}
              <span class="remove" @click="removeTag(tag)">✖</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Ингридиенты -->
      <div ref="tagsWrapper" class="tags shadow">
        <h2 class="theading">Какие ингридиенты вы собираетесь использовать?</h2>
  
        <my-input
          ref="ingridientInput"
          v-model="searchIngrid"
          class="tinput"
          :disableScale="true"
          placeholder="Найти"
          @focus="onIngridInputFocus"
        />
  
        <!-- Результаты поиска ингредиентов-->
        <div v-if="showIngridSearchResults" ref="IngridsearchResults" class="search-results">
          <ul v-if="filteredIngrid.length">
            <li
              v-for="ingrid in filteredIngrid"
              :key="ingrid.name"
              class="tag-item"
              @click="addIngrid(ingrid)"
            >
              {{ ingrid.name }}
            </li>
          </ul>
          <p v-else>Ничего не найдено</p>
        </div>
  
        <!-- Выбранные ингредиенты -->
        <div class="selected-tags" v-if="recipe.ingridients.length">
          <h3>Выбранные ингридиенты:</h3>
          <ul>
            <li v-for="ingrid in recipe.ingridients" :key="ingrid.id" class="selected-ingrid">
              {{ ingrid.name }}
              <my-input class="quantity" 
                        :disableScale="true"  
                        v-model="ingrid.quantity"  
                        placeholder="кол-во"/>
              <my-select 
                        class="units"
                        v-model="ingrid.unit"
                        :options="filteredUnits"
                        @focus="OnUnitsSelectFocus"
                        />
              <span class="remove" @click="removeIngrid(ingrid)">✖</span>
            </li>
          </ul>
        </div>
      </div>
  
      <!-- Параметры -->
      <div class="extra-fields">
        <div class="allow-shadow">
          <h2>Количество порций:</h2>
          <my-input 
          class="shadow allow-shadow"
          v-model="recipe.portions" 
          :disableScale="true"
          placeholder="Кол-во "
          type="number" />
        </div>
        <div class="allow-shadow">
          <h2>Калорийность (ккал):</h2>
          <my-input 
          class="shadow allow-shadow"
          v-model="recipe.calories" 
          :disableScale="true"
          placeholder="Ккал"
          type="number" />
        </div>

        <!--Сложность-->
        <div class="allow-shadow">
          <h2>Сложность:</h2>
          <select  class="select shadow allow-shadow" v-model="recipe.difficulty">
            <option value="EASY">Легкий</option>
            <option value="MEDIUM">Средний</option>
            <option value="HARD">Сложный</option>
          </select>
        </div>
      </div>
  
      <!--Этапы-->
      <div class="steps-section">
        <h2>Добавьте этапы приготовления</h2>
        <div 
          class="stage-item shadow"
          v-for="(stage, index) in recipe.stages" 
          :key="index"
        >
        <button 
          class="delete-step-button"
          @click="removeStep(index)"
        >
          ✖
        </button>

        <div class="stageHeading">
          <h2>Этап {{ index + 1 }} -</h2>
          <my-input 
            v-model="stage.title" 
            placeholder="Название этапа" 
            :disableScale="true"
            style="width: 80%;"
          />
        </div>
          <h3>Сколько времени потребуется на данный этап?</h3>
          <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <my-input 
              class="stage-input"
              v-model="stage.hours" 
              type="number" 
              placeholder="" 
              :disableScale="true"
            />
            <p style="margin-top: 18px;">Ч.</p>
            <my-input 
              class="stage-input"
              v-model="stage.minutes" 
              type="number" 
              placeholder="" 
              :disableScale="true"
            />
            <p style="margin-top: 18px;">мин.</p>
          </div>
          <h3>Опишите, что будет происходить на данном этапе</h3>
          <textarea 
            v-model="stage.description"
            class="stage-description"
          ></textarea>

          <!-- Загрузка и отображение фото для этапа -->
          <div style="display: flex; align-items: center; gap: 20px;">
            <img 
              :src="stage.previewUrl || placeholderImage" 
              alt="Фото этапа" 
              class="stage-img shadow"
            />
            <label class="file-label shadow">
              <input 
                type="file" 
                class="file-input"
                @change="uploadStepImage(index, $event)"
              />
              <span style="font-size: 1.1rem;">Загрузить фото</span>
            </label>
          </div>
        </div>

        <button 
          @click="addStage"
          class="btn-stage"
          >
          Добавить этап
        </button>
      </div>

      <div class="decide">
        <button 
        class="btn-decider shadow" 
        @click="setFalse(); saveRecipe(); CreateRecipe()">
        Сохранить рецепт
        </button>
        
        <button 
        class="btn-decider shadow" 
        @click="setTrue(); saveRecipe(); CreateRecipe()">
        Опубликовать рецепт
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import MySelect from "@/components/UI/MySelect.vue";
  import { ref, computed, onMounted, onBeforeUnmount } from "vue";
  import axios from "axios";
  import { watch } from "vue";
  import { stringifyQuery } from "vue-router";
  
  const placeholderImage = "https://i.pinimg.com/736x/ae/8a/c2/ae8ac2fa217d23aadcc913989fcc34a2.jpg";
  
  const user = ref(null)
  const token = localStorage.getItem('token')

  const searchTag = ref("");
  const showTagsSearchResults = ref(false);
  const showUnitsSelect = ref(false);
  const tagsWrapper = ref(null);
  
  const searchIngrid = ref("");
  const showIngridSearchResults = ref(false);

  const newTag = ref("");

  const recipeApi = axios.create({
    baseURL: 'https://mandrikov-ad.ru:8443/api/v1/recipe',
    headers: { 'Content-Type': 'multipart/form-data',
                Authorization: token}
  });

  const tagIngridientListApi = axios.create ({
    baseURL: 'https://mandrikov-ad.ru:8443/api/v1'
  })

  const addTagApi = axios.create ({
    baseURL: 'https://mandrikov-ad.ru:8443/api/v1',
    headers: {Authorization: token}
  })

  const getSerializedRecipe = () => ({
    title: recipe.value.title,
      description: recipe.value.description,
      calories: Number(recipe.value.calories),
      is_published: recipe.value.is_published,
      difficulty: recipe.value.difficulty,
      tags: recipe.value.tags.map(tag => tag.id),
      ingredients: recipe.value.ingridients.map(ing => ({
        ingredient_id: ing.id,
        unit_id: Number(ing.unit),
        quantity: Number(ing.quantity)
    })),
    stages: recipe.value.stages.map((stage, index) => ({
        title: stage.title,
        order_index: index + 1,
        description: stage.description,
        minutes: Number(stage.hours) * 60 + Number(stage.minutes)
      }))
    });

  const GetUnits = async () => {
    try{
      const response = await tagIngridientListApi.get('/ingredient/units');
      console.log(response.data);
      return response.data;
    }catch(error){
      console.log("Ошибка при получении единиц измерения", error)
    }
  }

  const GetTags = async () => {
    try{
      const response = await tagIngridientListApi.get('/tag',{
        params: {
        q: searchTag.value || "",
        page: 1,
        limit: 15
      }
    });
    return response.data.tags || [];
  } catch (error) {
    console.error('Ошибка при получении тегов:', error);
    return [];
  }
};

const GetIngredients = async () => {
  try {
    const response = await tagIngridientListApi.get('/ingredient', {
      params: {
        q: searchIngrid.value || "",
        page: 1,
        limit: 15
      }
    });
    return response.data.ingredients || [];
  } catch (error) {
    console.error('Ошибка при получении ингредиентов:', error);
    return [];
  }
};


  const CreateTag = async () => {
    try{
      const response = await addTagApi.post('/tag',{
        title: searchTag.value
      });
      if (response && response.data) {
        const createdTag = {
          id: response.data.id,
          name: response.data.title
        };
        addTag(createdTag);
        filteredTags.value.push(createdTag)
        console.log('Тег создан:', response.data);
    }
  } catch (error) {
    console.error("Ошибка при создании тега:", error.response?.data || error.message);
  }
}

  const CreateRecipe = async () => {
    const formData = new FormData();

    formData.append('recipe_data',JSON.stringify(getSerializedRecipe()));

    if (recipe.value.image) {
      formData.append('preview_image', recipe.value.image);
    }
    recipe.value.stages.forEach((stage, index) => {
      if (stage.image) {
        const renamed = new File([stage.image], `${index}`, { type: stage.image.type });
        formData.append('stage_images', renamed);
      }
    });
    try{
      await recipeApi.post('', formData)
      .then(response => {
        console.log('Рецепт успешно создан!', response.data);
      })
    }catch(error) {
        for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
      console.error('Ошибка при создании рецепта:', error);
    }
  };

  const recipe = ref({
    title: "",
    description: "",
    calories: "",
    is_published: true,
    difficulty: "Легкий",
    stages: [],
    image: null,
    imagePreview: "",
    portions: "",
    tags: [],
    ingridients: [],
    stage_images: []
  });
  
  const filteredUnits = ref([])
  const filteredTags = ref([]);

  const updateFilteredTags = async () => {
    filteredTags.value = await GetTags();
  };

  watch(searchTag, () => {
    showTagsSearchResults.value = true;
    updateFilteredTags();
  });
  watch(searchIngrid, async () => {
    filteredIngrid.value = await GetIngredients();
  });

  
  const addTag = (tag) => {
    if (!recipe.value.tags.some(t => t.id === tag.id)) {
      recipe.value.tags.push(tag);
    }
    searchTag.value = "";
    showTagsSearchResults.value = false;
  };

  const onTagInputFocus = async () => {
    showTagsSearchResults.value = true;
    filteredTags.value = await GetTags();
};

  const onIngridInputFocus = async () => {
    showIngridSearchResults.value = true;
    filteredIngrid.value = await GetIngredients();
};


const OnUnitsSelectFocus = async () => {
  showUnitsSelect.value = true;
  const unitsData = await GetUnits(); 
  console.log(unitsData);
  if (unitsData && Array.isArray(unitsData)) {
    filteredUnits.value = unitsData.map(unit => ({
    value: unit.id,
    name: unit.name 
  }));
} else {
  console.error("Данные отсутствуют или не являются массивом");
}

 
}
  
  const removeTag = (tag) => {
    recipe.value.tags = recipe.value.tags.filter(t => t.id !== tag.id);
  };
  
  const filteredIngrid = ref([]);

  const addIngrid = (ingrid) => {
    if (!recipe.value.ingridients.some(i => i.id === ingrid.id)) {
      recipe.value.ingridients.push({ ...ingrid, quantity: "" });
    }
    searchIngrid.value = "";
    showIngridSearchResults.value = false;
  };

  const removeIngrid = (ingrid) => {
    recipe.value.ingridients = recipe.value.ingridients.filter(i => i.id !== ingrid.id);
  };

  const uploadImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    recipe.value.image = file;
    recipe.value.imagePreview = URL.createObjectURL(file);
  }
};

  
  const tagInput = ref(null);
  const searchResults = ref(null);

  const handleClickOutsideTag = (event) => {
    const clickedInsideInput = tagInput.value?.$el?.contains(event.target);
    const clickedInsideSearch = searchResults.value?.contains(event.target);

  if (!clickedInsideInput && !clickedInsideSearch) {
    showTagsSearchResults.value = false;
  }
};
  onMounted(() => {
  document.addEventListener("click", handleClickOutsideTag);
});

  onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutsideTag);
});

  const ingridientInput = ref(null);
  const IngridsearchResults = ref(null);

const handleClickOutsideIngrid = (event) => {
    const clickedInsideInput = ingridientInput.value?.$el?.contains(event.target);
  const clickedInsideSearch = searchResults.value?.contains(event.target);

  if (!clickedInsideInput && !clickedInsideSearch) {
    showIngridSearchResults.value = false;
  }
};
  onMounted(() => {
  document.addEventListener("click", handleClickOutsideIngrid);
});

  onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutsideIngrid);
});

const addStage = () => {
  recipe.value.stages.push({
    title: '',
    hours: 0,
    minutes: 0,
    description: '',
    image: null,
    previewUrl: '',
    order: recipe.value.stages.length,
    totalMinutes: 0
  });
};

const updateTotalMinutes = () => {
  recipe.value.stages.forEach(stage => {
    stage.total_minutes = Number(stage.hours) * 60 + Number(stage.minutes);
  });
};

const removeStep = (index) => {
  recipe.value.stages.splice(index, 1);
};

const uploadStepImage = (index, event) => {
  const file = event.target.files[0];
  if (file) {
    recipe.value.stages[index].image = file;
    recipe.value.stages[index].previewUrl = URL.createObjectURL(file);
  }
};

const setFalse = () => {
  recipe.value.is_published = false
}

const setTrue = () => {
  recipe.value.is_published = true
}

const saveRecipe = () => {
  updateTotalMinutes();
    console.log("Сохраненный рецепт:", recipe.value);
  };

</script>
  
  <style scoped>
  .container {
    margin: 20px;
  }
  
  .heading {
    margin-top: 20px;
  }
  
  .title {
    width: 80%;
  }
  
  .recipe-image {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 50px;
    width: 90%;
    max-height: 600px;
    margin-top: 20px;
  }
  
  .file-input {
    display: none;
  }
  
  .file-label {
    background-color: #487e57;
    color: white;
    padding: 12px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    text-align: center;
    transition: background 0.3s;
    white-space: nowrap;
    align-self: end;
    margin-bottom: 45px;
  }
  
  .file-label:hover {
    background-color: #3a6e47;
  }
  
  .img {
    max-width: 60%;
    max-height: 550px;
    border-radius: 10px;
    display: block;
    margin-bottom: 40px;
  }
  
  .input {
    border-radius: 10px;
    width: 80%;
    height: 60%;
    background-color: #fff;
    background-image: none;
    padding-left: 20px;
  }
  
  .input:focus {
    background-color: #fff;
    border: 2px solid black;
  }
  
  .input.no-scale:hover,
  .input.no-scale:focus {
    transform: none !important;
  }
  
  .textarea {
    width: 80%;
    height: 200px;
    resize: both;
    line-height: 1.5rem;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid #000000;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
    padding-left: 20px;
    padding-top: 10px;
    font-size: 1.2rem;
    margin-top: 20px;
    overflow: auto;
  }
  
  .extra-fields {
    margin-top: 20px;
    display: grid;
    min-height: 100px;
    max-height: 250px;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
    overflow: visible;
  }

  .allow-shadow{
    overflow: visible;
  }
  
  .extra-fields input{
    background-image: none;
    background-color: white;
    padding: 0 10px;
    height: 40%;
    width: 50%;
  }

  .btn {
    width: 100%;
    padding: 10px;
    background-color: #487e57;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #3a6e47;
  }
  
  .shadow {
    box-shadow: 16px 17px 14px rgba(0, 0, 0, 0.01),
                17px 19px 8px rgba(0, 0, 0, 0.05),
                12px 4px 5px rgba(0, 0, 0, 0.09);
  }
  
  .tags {
    display: flex;
    flex-direction: column;
    width: 80%;
    min-height: 300px;
    margin-top: 20px;
    border: 1px solid black;
    background-color: white;
    border-radius: 10px;
    padding: 15px;
  }
  
  .theading {
    margin-bottom: 10px;
  }
  
  .tinput {
    width: 30%;
    height: 35px;
    border-radius: 5px;
    border: 1px solid black;
    background-color: #fff;
  }
  
  .search-results {
    margin-top: 10px;
    background-color: #f4f4f4;
    border: 1px solid #ccc;
    border-radius: 6px;
    max-height: 150px;
    overflow-y: auto;
    padding: 10px;
    width: 40%;
  }
  
  .tag-item {
    padding: 6px 10px;
    background-color: #e0ffe0;
    margin: 3px 0;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .tag-item:hover {
    background-color: #c8efc8;
  }
  
  .selected-tags {
    margin-top: 15px;
  }
  
  .selected-tags ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    gap: 10px;
  }
  
  .selected-tag {
    background-color: #c8efc8;
    padding: 6px 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .selected-ingrid {
    background-color: #c8efc8;
    padding: 6px 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
    max-width: 33%;
  }
  
  .remove  {
    margin: 0 auto;
    cursor: pointer;
    font-weight: bold;
    color: #555;
  }
  
  .remove:hover {
    color: red;
  }

  .quantity{
    height: 60%;
    width: 30%;
    border-radius: 5px;
    background-image: none;
    margin: 0 2% 0 2%;
    margin-top: 0;
    text-align: start;
    padding-left: 10px;
    padding-right: 5px;
    font-size: 1rem;
  }

  .units{
    width: 30%;
    height: 60%;
    border-radius: 5px;
    cursor: pointer;
  }

  .portions{
    display: flex;
    margin-top: 20px;
    gap:30px;
  }
  .portions input{
    background-image: none;
    width: 100%;
    margin: 0;
    padding: 0 15px;
    background-color: white;
  }

  .select{
    margin-left: 20px;
    margin-top: 13px;
    border-radius: 10px;
    height: 40%;
    font-size: 1.1rem;
  }

  .stage-item{
    position: relative;
    margin-top: 20px;
    padding-left:25px;
    padding-top: 15px;
    width: 80%;
    background-color: white;
    border: 1px solid black;
    margin-bottom: 10px; 
    border-radius: 10px;
  }

  .stageHeading{
    margin-top: 10px;
    display: flex;
    margin-bottom: 20px;
  }

  .stageHeading input{
    margin: 0 10px;
    max-width: 50%;
    height: 2.3rem;
    background-image: none;
    padding: 0 10px;
    background-color: #fff;
  }

  .stage-input{
    background-image: none;
    padding: 0 10px;
    background-color: #fff;
    width: 7%;
  }

  .stage-description{
    margin-top: 10px;
    width: 80%; 
    height: 100px; 
    margin-bottom: 10px;
    border-radius: 10px;
    border: 1.5px solid gray;
    padding: 10px 15px;
    font-size: 1.1rem;
    overflow: scroll;
  }

  .stage-img{
    margin-top: 10px;
    max-width: 60%;
    max-height: 80%; 
    border-radius: 10px;
    margin-bottom: 20px;
    border: 0.3px solid gray;
  }

  .btn-stage{
    background-color: #487e57; 
    color: white; 
    padding: 15px; 
    border-radius: 10px; 
    border: 1px solid; 
    cursor: pointer;
    margin-top: 20px;
    font-size: 1.1rem;
  }

  .delete-step-button {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ff4d4d;
    color: #ffffff;    
    border: 2px solid #a60000; 
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

  .delete-step-button:hover {
    background-color: white;
    color:#ff0000;
}

.decide {
  width: 80%;
  display: flex;
  flex-direction: column;   
  align-items: flex-end;    
  gap: 10px;               
  margin-top: 20px;         
}


  .btn-decider{
    margin-top: 10px; 
    font-size: 1.1rem;
    width: 40%;
    padding: 10px;
    background-color: #487e57;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
  </style>
  