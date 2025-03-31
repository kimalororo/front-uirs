<template>
    <div class="profile-page">
      <!-- Header and Navigation -->
      <header class="header">
        <nav class="nav">
          <ul>
            <li class="active">Home</li>
            <li>Recipes</li>
            <li>Meals</li>
            <li>Reviews</li>
            <li>Settings</li>
          </ul>
        </nav>
      </header>
  
      <!-- Profile Section -->
      <section class="profile">
        <img src="../components/icons/mater.png" alt="Avatar" class="avatar" />
        <div class="profile-info">
          <h1>Anna Kulinarova</h1>
          <h2>Anna Kulinarova</h2>
          <p>Люблю готовить быстрые и вкусные блюда</p>
          <div class="buttons">
            <button>My Recipes</button>
            <button class="secondary">Saved Plans</button>
          </div>
        </div>
      </section>
  
      <!-- Tabs -->
      <div class="tabs">
        <button class="active">My Recipes</button>
        <button>Saved Plans</button>
      </div>
  
      <!-- Recipes Section -->
      <section class="recipes">
        <h2>My Recipes</h2>
        <div class="recipe-list">
          <div class="recipe-card" v-for="n in 6" :key="n">
            <img src="../components/icons/food.png" alt="Recipe preview" />
            <h3>Recipe Title</h3>
            <p>Short description of the recipe...</p>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  // Add interactivity or imports here if needed later
  </script>
  
  <style scoped>
  .profile-page {
    font-family: 'Segoe UI', sans-serif;
    background: #e4f1f1;
    padding: 20px;
    color: #333;
  }
  
  .header .nav ul {
    display: flex;
    gap: 20px;
    list-style: none;
    justify-content: center;
    font-weight: bold;
  }
  
  .nav li {
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background 0.3s;
  }
  
  .nav .active {
    background: white;
    color: #339;
  }
  
  .profile {
    display: flex;
    align-items: center;
    margin: 40px 0;
    gap: 30px;
  }
  
  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .profile-info h1 {
    font-size: 2em;
    margin: 0;
  }
  
  .profile-info h2 {
    font-size: 1.2em;
    color: #669;
  }
  
  .profile-info .buttons {
    margin-top: 10px;
  }
  
  .buttons button {
    padding: 8px 16px;
    margin-right: 10px;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    background: white;
  }
  
  .buttons .secondary {
    background: #bce6da;
  }
  
  .tabs {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    gap: 10px;
  }
  
  .tabs button {
    padding: 8px 20px;
    border-radius: 12px;
    border: none;
    background: #d1ece1;
    cursor: pointer;
  }
  
  .tabs .active {
    background: #a9ddcc;
  }
  
  .recipes h2 {
    text-align: left;
    margin-bottom: 20px;
    padding-left: 10px;
  }
  
  .recipe-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  
  .recipe-card {
    width: 200px;
    border-radius: 16px;
    background: white;
    padding: 15px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .recipe-card img {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
    height: 120px;
  }
  </style>
  