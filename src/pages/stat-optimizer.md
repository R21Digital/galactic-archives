---
title: SWG Stat Optimizer
layout: base.njk
description: Optimize your SWG character stats and equipment for maximum performance
category: Tools
---

# SWG Stat Optimizer

Optimize your character's stats and equipment for maximum performance in SWG. This tool helps you plan your character build and find the best gear combinations.

## 📊 Character Stats Calculator

<form id="stat-calculator" class="optimizer-form">
  <div class="form-section">
    <h3>Basic Information</h3>
    <div class="form-group">
      <label for="profession">Profession *</label>
      <select id="profession" name="profession" required>
        <option value="">Select Profession...</option>
        <option value="bounty-hunter">Bounty Hunter</option>
        <option value="commando">Commando</option>
        <option value="smuggler">Smuggler</option>
        <option value="spy">Spy</option>
        <option value="medic">Medic</option>
        <option value="entertainer">Entertainer</option>
        <option value="artisan">Artisan</option>
        <option value="trader">Trader</option>
        <option value="ranger">Ranger</option>
        <option value="scout">Scout</option>
        <option value="squad-leader">Squad Leader</option>
        <option value="officer">Officer</option>
        <option value="pilot">Pilot</option>
        <option value="force-sensitive">Force Sensitive</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="level">Level</label>
      <input type="number" id="level" name="level" min="1" max="90" value="80">
    </div>
  </div>

  <div class="form-section">
    <h3>Base Stats</h3>
    <div class="stats-grid">
      <div class="form-group">
        <label for="health">Health</label>
        <input type="number" id="health" name="health" min="0" value="1000">
      </div>
      <div class="form-group">
        <label for="action">Action</label>
        <input type="number" id="action" name="action" min="0" value="1000">
      </div>
      <div class="form-group">
        <label for="mind">Mind</label>
        <input type="number" id="mind" name="mind" min="0" value="1000">
      </div>
      <div class="form-group">
        <label for="strength">Strength</label>
        <input type="number" id="strength" name="strength" min="0" value="100">
      </div>
      <div class="form-group">
        <label for="constitution">Constitution</label>
        <input type="number" id="constitution" name="constitution" min="0" value="100">
      </div>
      <div class="form-group">
        <label for="stamina">Stamina</label>
        <input type="number" id="stamina" name="stamina" min="0" value="100">
      </div>
      <div class="form-group">
        <label for="agility">Agility</label>
        <input type="number" id="agility" name="agility" min="0" value="100">
      </div>
      <div class="form-group">
        <label for="quickness">Quickness</label>
        <input type="number" id="quickness" name="quickness" min="0" value="100">
      </div>
      <div class="form-group">
        <label for="focus">Focus</label>
        <input type="number" id="focus" name="focus" min="0" value="100">
      </div>
      <div class="form-group">
        <label for="willpower">Willpower</label>
        <input type="number" id="willpower" name="willpower" min="0" value="100">
      </div>
    </div>
  </div>

  <div class="form-section">
    <h3>Combat Stats</h3>
    <div class="stats-grid">
      <div class="form-group">
        <label for="melee-accuracy">Melee Accuracy</label>
        <input type="number" id="melee-accuracy" name="melee-accuracy" min="0" value="0">
      </div>
      <div class="form-group">
        <label for="melee-speed">Melee Speed</label>
        <input type="number" id="melee-speed" name="melee-speed" min="0" value="0">
      </div>
      <div class="form-group">
        <label for="melee-damage">Melee Damage</label>
        <input type="number" id="melee-damage" name="melee-damage" min="0" value="0">
      </div>
      <div class="form-group">
        <label for="ranged-accuracy">Ranged Accuracy</label>
        <input type="number" id="ranged-accuracy" name="ranged-accuracy" min="0" value="0">
      </div>
      <div class="form-group">
        <label for="ranged-speed">Ranged Speed</label>
        <input type="number" id="ranged-speed" name="ranged-speed" min="0" value="0">
      </div>
      <div class="form-group">
        <label for="ranged-damage">Ranged Damage</label>
        <input type="number" id="ranged-damage" name="ranged-damage" min="0" value="0">
      </div>
      <div class="form-group">
        <label for="defense">Defense</label>
        <input type="number" id="defense" name="defense" min="0" value="0">
      </div>
      <div class="form-group">
        <label for="armor">Armor</label>
        <input type="number" id="armor" name="armor" min="0" value="0">
      </div>
    </div>
  </div>

  <div class="form-section">
    <h3>Equipment</h3>
    <div class="equipment-grid">
      <div class="form-group">
        <label for="weapon">Weapon</label>
        <select id="weapon" name="weapon">
          <option value="">None</option>
          <option value="vibro-axe">Vibro Axe</option>
          <option value="vibro-knuckler">Vibro Knuckler</option>
          <option value="sword">Sword</option>
          <option value="rifle">Rifle</option>
          <option value="pistol">Pistol</option>
          <option value="carbine">Carbine</option>
        </select>
      </div>
      <div class="form-group">
        <label for="armor-type">Armor Type</label>
        <select id="armor-type" name="armor-type">
          <option value="">None</option>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="heavy">Heavy</option>
          <option value="battle">Battle</option>
        </select>
      </div>
      <div class="form-group">
        <label for="shield">Shield</label>
        <select id="shield" name="shield">
          <option value="">None</option>
          <option value="light-shield">Light Shield</option>
          <option value="medium-shield">Medium Shield</option>
          <option value="heavy-shield">Heavy Shield</option>
        </select>
      </div>
    </div>
  </div>

  <button type="submit" class="optimize-btn">Calculate Optimal Stats</button>
</form>

## 📈 Results

<div id="optimization-results" class="results-section" style="display: none;">
  <h3>Optimization Analysis</h3>
  
  <div class="result-grid">
    <div class="result-card">
      <h4>Performance Score</h4>
      <div id="performance-score" class="score">--</div>
    </div>
    
    <div class="result-card">
      <h4>Recommended Improvements</h4>
      <ul id="recommendations" class="recommendations-list">
        <!-- Recommendations will be populated here -->
      </ul>
    </div>
    
    <div class="result-card">
      <h4>Stat Priorities</h4>
      <div id="stat-priorities" class="priorities">
        <!-- Priorities will be populated here -->
      </div>
    </div>
  </div>
  
  <div class="chart-section">
    <h4>Stat Distribution</h4>
    <div id="stat-chart" class="chart-container">
      <!-- Chart will be rendered here -->
    </div>
  </div>
</div>

## 🎯 How It Works

This optimizer analyzes your character's stats and provides recommendations based on:

- **Profession-specific requirements** - Each profession has optimal stat distributions
- **Combat effectiveness** - Balances offense and defense
- **Equipment synergy** - Considers how gear affects your stats
- **Level-appropriate scaling** - Adjusts recommendations based on character level

### **Profession-Specific Optimizations**

- **Bounty Hunter**: Focus on ranged combat and tracking abilities
- **Commando**: Heavy armor and melee/ranged hybrid
- **Medic**: Mind and focus for healing effectiveness
- **Artisan**: Stamina and mind for crafting
- **Entertainer**: Mind and focus for buffing

### **Combat Optimization**

The tool calculates optimal stat distributions for:
- **Melee Combat**: Strength, Constitution, Melee Accuracy
- **Ranged Combat**: Agility, Quickness, Ranged Accuracy
- **Defense**: Constitution, Armor, Defense Rating
- **Support**: Mind, Focus, Willpower

---

*This tool is designed to help you optimize your character build. Remember that personal playstyle and roleplay preferences are equally important!* 🎮

<script src="/scripts/statOptimizer.js"></script> 