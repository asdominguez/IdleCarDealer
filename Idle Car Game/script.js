"use strict";

const SAVE_KEY = "carDealerEmpireSaveV2";
const LEGACY_SAVE_KEY = "carDealerEmpireSaveV1";
const OFFLINE_CAP_MS = 2 * 60 * 60 * 1000;
const SAVE_INTERVAL_MS = 5000;
const PRESTIGE_INCOME_BONUS = 0.25;
const CASH_TO_AUCTION_CREDIT = 1_000_000_000_000;
const AUCTION_CREDIT_TO_CASH = 750_000_000_000;
const AUCTION_HOUSE_DEALERSHIP_REQUIREMENT = 20;
const OWNERSHIP_DOUBLE_MILESTONES = [25, 50, 100, 200, 500, 1000];
const CAR_SHOW_UNLOCK_CASH = 250_000_000_000_000;
const CAR_SHOW_ENTRY_FEE = 5_000_000_000_000;
const CAR_SHOW_PRIZES = [25_000_000_000_000, 10_000_000_000_000, 5_000_000_000_000];
const PERFORMANCE_PARTS = ["brakes", "engine", "transmission", "wing"];
const MAX_PART_TIER = 10;

const LEASED_CAR = {
  baseCost: 15,
  costGrowth: 1.17,
  baseClickPerCar: 1,
  clickGrowth: 1.14
};

const STREAMS = {
  turo: {
    id: "turo",
    name: "Turo Vehicles",
    shortName: "Turo",
    unlockPrestige: 0,
    description: "Rented economy and commuter vehicles earn money in the background while your listings run.",
    baseCost: 150,
    costGrowth: 1.145,
    baseIncome: 8,
    themes: [
      ["Better Listings", "Professional photos and tighter copy make every Turo car book more often."],
      ["Detail Bay", "A faster cleaning station gets cars back online with less downtime."],
      ["Five Star Followups", "Automated guest messages improve ratings and repeat bookings."],
      ["Airport Dropoffs", "Delivery service makes your fleet convenient for travelers."],
      ["Fleet Calendar", "Scheduling software keeps more vehicles rented at the right times."],
      ["Insurance Partner", "Lower operating risk lets each Turo vehicle earn more confidently."],
      ["Terminal Kiosks", "Airport pickup kiosks turn travelers into high-margin customers."]
    ]
  },
  lots: {
    id: "lots",
    name: "Used Car Lots",
    shortName: "Used Lots",
    unlockPrestige: 0,
    description: "Small dealerships sell inventory automatically through staff, financing, and steady foot traffic.",
    baseCost: 6_000,
    costGrowth: 1.155,
    baseIncome: 130,
    themes: [
      ["Closer Training", "Sharper sales staff move inventory without constant owner attention."],
      ["Finance Desk", "In-house financing raises approval rates and deal profit."],
      ["Radio Ads", "Local advertising brings more buyers onto the lot each day."],
      ["Auction Access", "Better auction lanes improve margins on every vehicle sold."],
      ["Warranty Office", "Warranty packages add reliable back-end profit."],
      ["Dealer Reputation", "A trusted local name makes buyers show up ready to sign."],
      ["Fast Turn System", "Inventory turnover tools keep cash cycling through the lot."]
    ]
  },
  luxury: {
    id: "luxury",
    name: "Luxury Vehicle Rentals",
    shortName: "Luxury",
    unlockPrestige: 0,
    description: "High-end vehicles rent to executives, events, and VIP clients for major passive income.",
    baseCost: 220_000,
    costGrowth: 1.165,
    baseIncome: 5_800,
    themes: [
      ["VIP Client Book", "A private client list keeps premium vehicles booked on short notice."],
      ["Concierge Desk", "White-glove service raises rental rates and customer loyalty."],
      ["Exotic Sourcing", "Better sourcing unlocks rarer cars with stronger margins."],
      ["Celebrity Tie-In", "Public partnerships make the fleet feel exclusive."],
      ["Luxury Campaigns", "Premium marketing attracts clients willing to pay for status."],
      ["Private Terminal", "Airport terminal access turns arrivals into luxury bookings."],
      ["Corporate Contracts", "Executive rental contracts create steady high-value demand."]
    ]
  },
  newDealerships: {
    id: "newDealerships",
    name: "New Car Dealerships",
    shortName: "New Cars",
    unlockPrestige: 1,
    description: "Franchise rooftops sell new inventory, service plans, and corporate fleet deals automatically.",
    baseCost: 45_000_000,
    costGrowth: 1.18,
    baseIncome: 850_000,
    themes: [
      ["Franchise Agreement", "Manufacturer franchise rights unlock stronger new-car margins."],
      ["Factory Incentives", "Better incentive programs improve profit on every unit sold."],
      ["Elite Sales Team", "A dedicated new-car sales floor closes buyers faster."],
      ["Finance Department", "Captive financing raises approval rates and deal value."],
      ["Service Department", "Service lanes add dependable recurring revenue."],
      ["Warranty Program", "Warranty products increase back-end profit per sale."],
      ["Commercial Advertising", "Regional campaigns bring shoppers to the showroom."],
      ["Inventory Management", "Allocation software keeps the right trims in stock."],
      ["Manufacturer Allocation", "Priority allocations secure higher-demand vehicles."],
      ["Corporate Fleet Sales", "Fleet contracts move vehicles in large batches."],
      ["Showroom Renovation", "A premium showroom raises close rates and customer trust."],
      ["Regional Expansion", "Multi-rooftop operations compound every manufacturer relationship."]
    ]
  },
  manufacturerDealerships: {
    id: "manufacturerDealerships",
    name: "Manufacturer Dealerships",
    shortName: "Manufacturer",
    unlockPrestige: 2,
    description: "Manufacturer-backed corporate rooftops turn factory relationships into massive automatic revenue.",
    baseCost: 9_000_000_000_000,
    costGrowth: 1.19,
    baseIncome: 160_000_000_000,
    themes: [
      ["Exclusive Contracts", "Direct manufacturer contracts unlock protected territories and stronger margins."],
      ["Corporate Financing", "Factory-backed lending programs raise approvals across the network."],
      ["National Advertising", "National campaigns make every showroom easier to sell through."],
      ["Priority Allocations", "Factory priority sends high-demand models to your stores first."],
      ["Performance Bonuses", "Manufacturer volume bonuses add major profit to each unit."],
      ["Certified Service Centers", "Factory-certified service work creates recurring revenue."],
      ["Logistics Agreements", "Corporate logistics reduce delivery delays and holding costs."],
      ["Regional Expansion", "Regional dealership clusters multiply operating leverage."],
      ["Fleet Division", "Fleet sales teams land large commercial contracts."],
      ["Premium Lounges", "Customer lounges improve retention and premium sales."],
      ["Automated Inventory", "Automated inventory systems keep the right models moving."],
      ["Backed Warranties", "Manufacturer-backed warranties increase back-end profit."],
      ["Brand Reputation", "Brand trust improves close rates across the group."],
      ["Network Scaling", "Network-wide systems compound every rooftop."],
      ["Executive Sales Team", "Executive sales leaders close the largest corporate accounts."]
    ]
  }
};

const UPGRADE_BALANCE = {
  turo: { baseCost: 500, growth: 1.86 },
  lots: { baseCost: 15_000, growth: 1.88 },
  luxury: { baseCost: 320_000, growth: 1.92 },
  newDealerships: { baseCost: 95_000_000, growth: 1.9 },
  manufacturerDealerships: { baseCost: 18_000_000_000_000, growth: 1.92 }
};

const PRESTIGE_UPGRADES = [
  {
    id: "globalIncome",
    name: "Empire Playbook",
    description: "Permanent +25% to every source of income.",
    cost: 1,
    effect: "All income x1.25"
  },
  {
    id: "clickIncome",
    name: "Lease Desk Scripts",
    description: "Permanent +50% click income from leased cars.",
    cost: 1,
    effect: "Click income x1.50"
  },
  {
    id: "passiveIncome",
    name: "Operator Network",
    description: "Permanent +35% passive business income.",
    cost: 2,
    effect: "Passive income x1.35"
  },
  {
    id: "passiveCost",
    name: "Vendor Leverage",
    description: "Permanent 10% discount on passive business purchases.",
    cost: 2,
    effect: "Passive costs -10%"
  },
  {
    id: "auctionProfit",
    name: "Auction Shark",
    description: "Permanent +20% payout when selling auction vehicles.",
    cost: 3,
    effect: "Auction sale payouts x1.20"
  }
];

const CONDITIONS = [
  { name: "Salvage", valueMultiplier: 0.45, upgradeCost: 2 },
  { name: "Poor", valueMultiplier: 0.62, upgradeCost: 4 },
  { name: "Fair", valueMultiplier: 0.82, upgradeCost: 8 },
  { name: "Good", valueMultiplier: 1.0, upgradeCost: 14 },
  { name: "Excellent", valueMultiplier: 1.22, upgradeCost: 24 },
  { name: "Mint", valueMultiplier: 1.48, upgradeCost: Infinity }
];

const VEHICLE_POOL = [
  ["Toyota", "Camry", 2014, 24], ["Honda", "Civic", 2016, 21], ["Ford", "Fusion", 2015, 23],
  ["Chevrolet", "Malibu", 2017, 24], ["Nissan", "Altima", 2016, 23], ["Hyundai", "Elantra", 2018, 19],
  ["Kia", "Soul", 2017, 18], ["Subaru", "Outback", 2015, 28], ["Mazda", "Mazda3", 2018, 22],
  ["Volkswagen", "Jetta", 2016, 20], ["Toyota", "RAV4", 2015, 27], ["Honda", "CR-V", 2014, 26],
  ["Ford", "F-150 XL", 2013, 30], ["Chevrolet", "Silverado 1500", 2012, 31], ["Dodge", "Charger SXT", 2016, 29],
  ["BMW", "328i", 2014, 38], ["Mercedes-Benz", "C300", 2013, 39], ["Lexus", "ES 350", 2015, 38]
];

const SHOW_VEHICLE_POOL = [
  ["Nissan", "Skyline GT-R V-Spec", 1999, 180], ["Toyota", "Supra Turbo", 1998, 145],
  ["Mazda", "RX-7 Spirit R", 2002, 130], ["Acura", "NSX Type S", 2022, 210],
  ["Ferrari", "458 Speciale", 2015, 420], ["Lamborghini", "Huracan STO", 2022, 390],
  ["Porsche", "Carrera GT", 2005, 900], ["McLaren", "720S", 2020, 360],
  ["Dodge", "Challenger Demon", 2018, 185], ["Chevrolet", "Camaro ZL1 1LE", 2019, 95],
  ["Ford", "GT", 2017, 620], ["Bugatti", "Chiron", 2019, 2800]
];

const state = {
  cash: 0,
  prestige: 0,
  prestigeTokens: 0,
  prestigeUpgrades: [],
  leasedCars: 1,
  businesses: createFreshBusinesses(),
  auctionCredits: 0,
  reservedAuctionCredits: 0,
  parkingSpaces: 1,
  ownedVehicles: [],
  activeAuction: null,
  activeShowAuction: null,
  carShowUnlocked: false,
  carShowEntries: [],
  carShowResults: null,
  saleMessage: "",
  lastSaved: Date.now()
};

let activeUpgradeTab = "all";
let activeAuctionTab = "auction";
let activeScreen = "main";
let lastTick = Date.now();
let lastSave = Date.now();
let lastPrestigeUpgradeSignature = "";
let lastAuctionSignature = "";
const dropdownState = {
  passiveUpgrades: true
};

const upgrades = buildUpgrades();

const elements = {
  cash: document.getElementById("cash"),
  auctionCredits: document.getElementById("auctionCredits"),
  prestigeLevel: document.getElementById("prestigeLevel"),
  prestigeTokens: document.getElementById("prestigeTokens"),
  prestigeBonus: document.getElementById("prestigeBonus"),
  incomePerSecond: document.getElementById("incomePerSecond"),
  carsOwned: document.getElementById("carsOwned"),
  clickValue: document.getElementById("clickValue"),
  leasedCarPrice: document.getElementById("leasedCarPrice"),
  collectButton: document.getElementById("collectButton"),
  buyLeasedCar: document.getElementById("buyLeasedCar"),
  mainScreen: document.getElementById("mainScreen"),
  prestigeScreen: document.getElementById("prestigeScreen"),
  auctionScreen: document.getElementById("auctionScreen"),
  carShowScreen: document.getElementById("carShowScreen"),
  businessGrid: document.getElementById("businessGrid"),
  prestigeUpgradeGrid: document.getElementById("prestigeUpgradeGrid"),
  prestigeUpgradesBody: document.getElementById("prestigeUpgradesBody"),
  upgradeGrid: document.getElementById("upgradeGrid"),
  passiveUpgradesBody: document.getElementById("passiveUpgradesBody"),
  passiveUpgradesToggle: document.getElementById("passiveUpgradesToggle"),
  buyAllPassiveUpgrades: document.getElementById("buyAllPassiveUpgrades"),
  prestigeButton: document.getElementById("prestigeButton"),
  prestigeDescription: document.getElementById("prestigeDescription"),
  prestigeRequirements: document.getElementById("prestigeRequirements"),
  prestigeTokenPill: document.getElementById("prestigeTokenPill"),
  saveStatus: document.getElementById("saveStatus"),
  resetSave: document.getElementById("resetSave"),
  offlineNotice: document.getElementById("offlineNotice"),
  auctionUnlockState: document.getElementById("auctionUnlockState"),
  auctionLocked: document.getElementById("auctionLocked"),
  auctionContent: document.getElementById("auctionContent"),
  auctionCreditsPanel: document.getElementById("auctionCreditsPanel"),
  parkingStatus: document.getElementById("parkingStatus"),
  convertCashToCredits: document.getElementById("convertCashToCredits"),
  convertCreditsToCash: document.getElementById("convertCreditsToCash"),
  buyParking: document.getElementById("buyParking"),
  activeAuctionView: document.getElementById("activeAuctionView"),
  ownedVehiclesView: document.getElementById("ownedVehiclesView"),
  carShowUnlockState: document.getElementById("carShowUnlockState"),
  carShowLocked: document.getElementById("carShowLocked"),
  carShowContent: document.getElementById("carShowContent"),
  carShowGarage: document.getElementById("carShowGarage"),
  carShowEntries: document.getElementById("carShowEntries"),
  screenButtons: [...document.querySelectorAll("[data-screen]")],
  tabs: [...document.querySelectorAll(".tab")],
  auctionTabs: [...document.querySelectorAll(".auction-tab")]
};

function createFreshBusinesses() {
  return Object.keys(STREAMS).reduce((businesses, streamId) => {
    businesses[streamId] = { owned: 0, purchasedUpgrades: [] };
    return businesses;
  }, {});
}

function buildUpgrades() {
  const result = {};

  Object.values(STREAMS).forEach((stream) => {
    const maxUpgrades = stream.unlockPrestige > 0 ? 30 : 100;
    result[stream.id] = Array.from({ length: maxUpgrades }, (_, index) => {
      const theme = stream.themes[index % stream.themes.length];
      const tier = index + 1;
      const cycle = Math.floor(index / stream.themes.length) + 1;
      const effectKind = index % 5 === 4 ? "discount" : "income";
      const effectValue = effectKind === "income" ? 1.32 + cycle * 0.05 : 0.92;
      const cost = Math.floor(UPGRADE_BALANCE[stream.id].baseCost * Math.pow(UPGRADE_BALANCE[stream.id].growth, index));
      const suffix = cycle === 1 ? "" : ` ${toRoman(cycle)}`;

      return {
        id: `${stream.id}-${tier}`,
        tier,
        name: `${theme[0]}${suffix}`,
        description: theme[1],
        cost,
        effect: { type: effectKind, value: effectValue }
      };
    });
  });

  return result;
}

function toRoman(value) {
  return ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][value] || `${value}`;
}

function formatCurrency(value) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const units = [
    ["Qi", 1_000_000_000_000_000_000],
    ["Qa", 1_000_000_000_000_000],
    ["T", 1_000_000_000_000],
    ["B", 1_000_000_000],
    ["M", 1_000_000],
    ["K", 1_000]
  ];

  for (const [suffix, amount] of units) {
    if (abs >= amount) return `${sign}$${(abs / amount).toFixed(1)}${suffix}`;
  }

  return `${sign}$${Math.floor(abs).toLocaleString()}`;
}

function formatCredits(value) {
  return `${Math.floor(value).toLocaleString()} AC`;
}

function formatQuantity(value, singular, plural = `${singular}s`) {
  return `${value.toLocaleString()} ${value === 1 ? singular : plural}`;
}

function hasPrestigeUpgrade(id) {
  return state.prestigeUpgrades.includes(id);
}

function getPrestigeMultiplier() {
  return 1 + state.prestige * PRESTIGE_INCOME_BONUS;
}

function getPermanentAllIncomeMultiplier() {
  return hasPrestigeUpgrade("globalIncome") ? 1.25 : 1;
}

function getClickMultiplier() {
  return getPrestigeMultiplier() * getPermanentAllIncomeMultiplier() * (hasPrestigeUpgrade("clickIncome") ? 1.5 : 1);
}

function getPassiveMultiplier() {
  return getPrestigeMultiplier() * getPermanentAllIncomeMultiplier() * (hasPrestigeUpgrade("passiveIncome") ? 1.35 : 1);
}

function getPassiveCostMultiplier() {
  return hasPrestigeUpgrade("passiveCost") ? 0.9 : 1;
}

function getAuctionSaleMultiplier() {
  return hasPrestigeUpgrade("auctionProfit") ? 1.2 : 1;
}

function getAvailableUpgradeCount(streamId) {
  if (STREAMS[streamId].unlockPrestige > 0) return state.prestige >= STREAMS[streamId].unlockPrestige ? 30 : 0;
  return 30 + Math.max(0, state.prestige - 3) * 5;
}

function isStreamUnlocked(streamId) {
  return state.prestige >= STREAMS[streamId].unlockPrestige;
}

function getLeasedCarCost() {
  return Math.floor(LEASED_CAR.baseCost * Math.pow(LEASED_CAR.costGrowth, state.leasedCars - 1));
}

function getClickValue() {
  const base = LEASED_CAR.baseClickPerCar * state.leasedCars * Math.pow(LEASED_CAR.clickGrowth, state.leasedCars - 1);
  return base * getClickMultiplier();
}

function getPurchasedUpgrades(streamId) {
  return state.businesses[streamId]?.purchasedUpgrades || [];
}

function hasUpgrade(streamId, upgradeId) {
  return getPurchasedUpgrades(streamId).includes(upgradeId);
}

function getStreamModifiers(streamId) {
  return upgrades[streamId].slice(0, getAvailableUpgradeCount(streamId)).reduce((mods, upgrade) => {
    if (!hasUpgrade(streamId, upgrade.id)) return mods;
    if (upgrade.effect.type === "income") mods.income *= upgrade.effect.value;
    if (upgrade.effect.type === "discount") mods.cost *= upgrade.effect.value;
    return mods;
  }, { income: 1, cost: 1 });
}

function getBusinessCost(streamId) {
  const stream = STREAMS[streamId];
  const owned = state.businesses[streamId].owned;
  const modifiers = getStreamModifiers(streamId);
  return Math.floor(stream.baseCost * Math.pow(stream.costGrowth, owned) * modifiers.cost * getPassiveCostMultiplier());
}

function getBusinessIncomeEach(streamId) {
  const stream = STREAMS[streamId];
  const modifiers = getStreamModifiers(streamId);
  return stream.baseIncome * modifiers.income * getPassiveMultiplier() * getOwnershipMilestoneMultiplier(streamId);
}

function getBusinessIncomeTotal(streamId) {
  if (!isStreamUnlocked(streamId)) return 0;
  return state.businesses[streamId].owned * getBusinessIncomeEach(streamId);
}

function getOwnershipMilestoneMultiplier(streamId) {
  const owned = state.businesses[streamId].owned;
  let doubles = OWNERSHIP_DOUBLE_MILESTONES.filter((milestone) => owned >= milestone).length;

  if (owned >= 2000) {
    doubles += Math.floor((owned - 1000) / 1000);
  }

  return Math.pow(2, doubles);
}

function getTotalIncomePerSecond() {
  return Object.keys(STREAMS).reduce((total, streamId) => total + getBusinessIncomeTotal(streamId), 0);
}

function getPrestigeRequirement() {
  const nextPrestige = state.prestige + 1;
  if (nextPrestige === 1) {
    return { nextPrestige, cash: 10_000_000_000, auctionCredits: 0 };
  }

  return {
    nextPrestige,
    cash: 50_000_000_000_000 * Math.pow(3.2, nextPrestige - 2),
    auctionCredits: 35 * Math.pow(2.15, nextPrestige - 2)
  };
}

function canPrestige() {
  const requirement = getPrestigeRequirement();
  return state.cash >= requirement.cash && state.auctionCredits >= requirement.auctionCredits;
}

function buyLeasedCar() {
  const cost = getLeasedCarCost();
  if (state.cash < cost) return;
  state.cash -= cost;
  state.leasedCars += 1;
  updateUI();
}

function buyBusiness(streamId) {
  if (!isStreamUnlocked(streamId)) return;
  const cost = getBusinessCost(streamId);
  if (state.cash < cost) return;
  state.cash -= cost;
  state.businesses[streamId].owned += 1;
  updateUI();
}

function buyBusinessBulk(streamId, amount) {
  if (!isStreamUnlocked(streamId)) return;
  let purchased = 0;
  const target = amount === "max" ? Infinity : amount;

  while (purchased < target) {
    const cost = getBusinessCost(streamId);
    if (state.cash < cost) break;
    state.cash -= cost;
    state.businesses[streamId].owned += 1;
    purchased += 1;
  }

  if (purchased > 0) updateUI();
}

function buyUpgrade(streamId, upgradeId) {
  const upgrade = upgrades[streamId].find((item) => item.id === upgradeId);
  if (!upgrade || hasUpgrade(streamId, upgradeId) || state.cash < upgrade.cost) return;
  state.cash -= upgrade.cost;
  state.businesses[streamId].purchasedUpgrades.push(upgradeId);
  updateUI();
}

function buyAllAffordablePassiveUpgrades() {
  let purchasedAny = false;
  let purchasedThisPass = true;

  while (purchasedThisPass) {
    purchasedThisPass = false;
    const affordable = Object.keys(STREAMS)
      .filter((streamId) => isStreamUnlocked(streamId))
      .flatMap((streamId) => upgrades[streamId]
        .slice(0, getAvailableUpgradeCount(streamId))
        .filter((upgrade) => !hasUpgrade(streamId, upgrade.id) && state.cash >= upgrade.cost)
        .map((upgrade) => ({ ...upgrade, streamId })))
      .sort((a, b) => a.cost - b.cost);

    if (affordable.length) {
      const upgrade = affordable[0];
      state.cash -= upgrade.cost;
      state.businesses[upgrade.streamId].purchasedUpgrades.push(upgrade.id);
      purchasedAny = true;
      purchasedThisPass = true;
    }
  }

  if (purchasedAny) updateUI();
}

function hasAnyAffordablePassiveUpgrade() {
  return Object.keys(STREAMS)
    .filter((streamId) => isStreamUnlocked(streamId))
    .some((streamId) => upgrades[streamId]
      .slice(0, getAvailableUpgradeCount(streamId))
      .some((upgrade) => !hasUpgrade(streamId, upgrade.id) && state.cash >= upgrade.cost));
}

function buyPrestigeUpgrade(upgradeId) {
  const upgrade = PRESTIGE_UPGRADES.find((item) => item.id === upgradeId);
  if (!upgrade || hasPrestigeUpgrade(upgradeId) || state.prestigeTokens < upgrade.cost) return;
  state.prestigeTokens -= upgrade.cost;
  state.prestigeUpgrades.push(upgradeId);
  updateUI();
}

function resetRunProgress() {
  state.cash = 0;
  state.leasedCars = 1;
  state.businesses = createFreshBusinesses();
  state.auctionCredits = 0;
  state.reservedAuctionCredits = 0;
  state.parkingSpaces = 1;
  state.ownedVehicles = [];
  state.activeAuction = null;
  state.activeShowAuction = null;
  state.carShowUnlocked = false;
  state.carShowEntries = [];
  state.carShowResults = null;
  state.saleMessage = "";
}

function prestige() {
  if (!canPrestige()) return;
  const nextPrestige = state.prestige + 1;
  state.prestige = nextPrestige;
  state.prestigeTokens += nextPrestige;
  resetRunProgress();
  state.lastSaved = Date.now();
  if (activeUpgradeTab !== "all" && !isStreamUnlocked(activeUpgradeTab)) activeUpgradeTab = "all";
  renderBusinessCards();
  renderUpgradeTabs();
  renderUpgrades();
  saveGame("Prestiged and saved");
  updateUI();
}

function isAuctionUnlocked() {
  return state.prestige >= 1 && state.businesses.newDealerships.owned >= AUCTION_HOUSE_DEALERSHIP_REQUIREMENT;
}

function getUsedParkingSpaces() {
  return state.ownedVehicles.length;
}

function getParkingCost() {
  return Math.ceil(6 * Math.pow(1.55, state.parkingSpaces - 1));
}

function generateVehicle() {
  return generateAuctionVehicle(false);
}

function generateShowVehicle() {
  return generateAuctionVehicle(true);
}

function generateAuctionVehicle(isShowCar) {
  const pool = isShowCar ? SHOW_VEHICLE_POOL : VEHICLE_POOL;
  const template = pool[Math.floor(Math.random() * pool.length)];
  const conditionIndex = isShowCar ? 2 + Math.floor(Math.random() * 4) : Math.floor(Math.random() * 4);
  const msrp = template[2] > 2010 ? template[3] : Math.round(template[3] * 0.75);
  const collectorSwing = isShowCar ? 1.25 + Math.random() * 1.8 : 0.8 + Math.random() * 1.4;
  const trueValue = Math.max(1, Math.round(msrp * CONDITIONS[conditionIndex].valueMultiplier * collectorSwing));
  const estimatedValue = Math.max(1, Math.round(trueValue * (0.5 + Math.random())));
  const startingBid = Math.max(1, Math.floor(trueValue * (0.38 + Math.random() * 0.2)));

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    make: template[0],
    model: template[1],
    year: template[2],
    msrp,
    conditionIndex,
    isShowCar,
    parts: isShowCar ? createPerformanceParts() : null,
    estimatedValue,
    trueValue,
    startingBid,
    currentBid: startingBid,
    highBidder: "CPU",
    playerReserve: 0,
    round: 0,
    message: isShowCar ? "Show-car auction opened. Expect aggressive collector bidding." : "Auction opened. Place a bid to compete with dealer buyers."
  };
}

function createPerformanceParts(minTier = 1, maxTier = 3) {
  return PERFORMANCE_PARTS.reduce((parts, part) => {
    parts[part] = minTier + Math.floor(Math.random() * (maxTier - minTier + 1));
    return parts;
  }, {});
}

function ensureActiveAuction() {
  if (isAuctionUnlocked() && !state.activeAuction) {
    state.activeAuction = generateVehicle();
  }
  if (isCarShowUnlocked() && !state.activeShowAuction) {
    state.activeShowAuction = generateShowVehicle();
  }
}

function isCarShowUnlocked() {
  return state.prestige >= 2 && state.carShowUnlocked;
}

function placeAuctionBid(auctionType = "standard") {
  if (!isAuctionUnlocked()) return;
  ensureActiveAuction();
  const auction = getAuctionByType(auctionType);
  if (getUsedParkingSpaces() >= state.parkingSpaces) {
    auction.message = "You need an open parking space before you can bid on another vehicle.";
    updateUI();
    return;
  }
  if (auction.highBidder === "Player") {
    auction.message = "You are already the high bidder. Let the floor react.";
    updateUI();
    return;
  }

  const bid = Math.ceil(auction.currentBid + Math.max(1, auction.trueValue * 0.08));
  if (state.auctionCredits < bid) {
    auction.message = `You need ${formatCredits(bid)} to place the next bid.`;
    updateUI();
    return;
  }

  state.auctionCredits -= bid;
  state.reservedAuctionCredits += bid;
  auction.playerReserve = bid;
  auction.currentBid = bid;
  auction.highBidder = "Player";
  auction.round += 1;

  const cpuLimit = auction.trueValue * (0.72 + Math.random() * 0.62);
  const cpuKeepsBidding = auction.round < 3 && auction.currentBid < cpuLimit && Math.random() < 0.72;

  if (cpuKeepsBidding) {
    state.auctionCredits += auction.playerReserve;
    state.reservedAuctionCredits -= auction.playerReserve;
    auction.playerReserve = 0;
    auction.currentBid = Math.ceil(auction.currentBid + Math.max(1, auction.trueValue * (0.06 + Math.random() * 0.08)));
    auction.highBidder = "CPU";
    auction.message = "A dealer group outbid you. Your reserved credits were returned.";
  } else {
    winAuction(auctionType);
  }

  updateUI();
}

function getAuctionByType(auctionType) {
  return auctionType === "show" ? state.activeShowAuction : state.activeAuction;
}

function setAuctionByType(auctionType, auction) {
  if (auctionType === "show") {
    state.activeShowAuction = auction;
  } else {
    state.activeAuction = auction;
  }
}

function winAuction(auctionType = "standard") {
  const auction = getAuctionByType(auctionType);
  state.reservedAuctionCredits -= auction.playerReserve;
  state.ownedVehicles.push({
    id: auction.id,
    make: auction.make,
    model: auction.model,
    year: auction.year,
    msrp: auction.msrp,
    conditionIndex: auction.conditionIndex,
    isShowCar: Boolean(auction.isShowCar),
    parts: auction.parts,
    estimatedValue: auction.estimatedValue,
    trueValue: auction.trueValue,
    appraised: false,
    purchasePrice: auction.playerReserve
  });
  state.saleMessage = `Won ${auction.year} ${auction.make} ${auction.model} for ${formatCredits(auction.playerReserve)}.`;
  setAuctionByType(auctionType, auctionType === "show" ? generateShowVehicle() : generateVehicle());
}

function skipAuction(auctionType = "standard") {
  const auction = getAuctionByType(auctionType);
  if (auction?.playerReserve) {
    state.auctionCredits += auction.playerReserve;
    state.reservedAuctionCredits -= auction.playerReserve;
  }
  setAuctionByType(auctionType, auctionType === "show" ? generateShowVehicle() : generateVehicle());
  updateUI();
}

function convertCashToCredits() {
  if (state.cash < CASH_TO_AUCTION_CREDIT) return;
  state.cash -= CASH_TO_AUCTION_CREDIT;
  state.auctionCredits += 1;
  updateUI();
}

function convertCreditsToCash() {
  if (state.auctionCredits < 1) return;
  state.auctionCredits -= 1;
  state.cash += AUCTION_CREDIT_TO_CASH;
  updateUI();
}

function buyParking() {
  const cost = getParkingCost();
  if (state.auctionCredits < cost) return;
  state.auctionCredits -= cost;
  state.parkingSpaces += 1;
  updateUI();
}

function getVehicleById(vehicleId) {
  return state.ownedVehicles.find((vehicle) => vehicle.id === vehicleId);
}

function getVehicleSaleValue(vehicle) {
  return Math.ceil(vehicle.trueValue * getShowCarSaleMultiplier(vehicle));
}

function getShowCarSaleMultiplier(vehicle) {
  if (!vehicle?.isShowCar || !vehicle.parts) return 1;
  const tiers = PERFORMANCE_PARTS.map((part) => vehicle.parts[part] || 1);
  if (!tiers.every((tier) => tier >= MAX_PART_TIER - 2)) return 1;
  const averageTier = tiers.reduce((sum, tier) => sum + tier, 0) / tiers.length;
  return 1 + (averageTier - (MAX_PART_TIER - 3)) * 0.18;
}

function appraiseVehicle(vehicleId) {
  const vehicle = getVehicleById(vehicleId);
  const cost = getAppraisalCost(vehicle);
  if (!vehicle || vehicle.appraised || state.auctionCredits < cost) return;
  state.auctionCredits -= cost;
  vehicle.appraised = true;
  updateUI();
}

function getAppraisalCost(vehicle) {
  return Math.max(1, Math.ceil(vehicle.trueValue * 0.08));
}

function getConditionUpgradeCost(vehicle) {
  if (!vehicle || vehicle.conditionIndex >= CONDITIONS.length - 1) return Infinity;
  return Math.ceil(CONDITIONS[vehicle.conditionIndex].upgradeCost * Math.pow(1.35, vehicle.conditionIndex));
}

function upgradeVehicleCondition(vehicleId) {
  const vehicle = getVehicleById(vehicleId);
  const cost = getConditionUpgradeCost(vehicle);
  if (!vehicle || state.auctionCredits < cost || vehicle.conditionIndex >= CONDITIONS.length - 1) return;
  state.auctionCredits -= cost;
  vehicle.conditionIndex += 1;
  vehicle.trueValue = Math.ceil(vehicle.trueValue * 1.22);
  vehicle.estimatedValue = Math.ceil(vehicle.estimatedValue * 1.15);
  updateUI();
}

function instantSellVehicle(vehicleId) {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle || !vehicle.appraised) return;
  const payout = Math.ceil(getVehicleSaleValue(vehicle) * getAuctionSaleMultiplier());
  state.auctionCredits += payout;
  removeVehicle(vehicleId);
  state.saleMessage = `Instant sale complete for ${formatCredits(payout)}.`;
  updateUI();
}

function auctionSellVehicle(vehicleId) {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return;
  const saleValue = getVehicleSaleValue(vehicle);
  const startingBid = Math.ceil(saleValue * (0.4 + Math.random() * 0.3));
  const finalPrice = Math.max(1, Math.ceil(saleValue * (0.72 + Math.random() * 0.72) * getAuctionSaleMultiplier()));
  state.auctionCredits += finalPrice;
  removeVehicle(vehicleId);
  state.saleMessage = `Your ${vehicle.year} ${vehicle.make} ${vehicle.model} opened at ${formatCredits(startingBid)} and sold for ${formatCredits(finalPrice)}.`;
  updateUI();
}

function removeVehicle(vehicleId) {
  state.ownedVehicles = state.ownedVehicles.filter((vehicle) => vehicle.id !== vehicleId);
}

function getPartUpgradeCost(vehicle, part) {
  const tier = vehicle?.parts?.[part] || 1;
  if (tier >= MAX_PART_TIER) return Infinity;
  return Math.ceil(4 * Math.pow(1.85, tier - 1) * Math.max(1, vehicle.trueValue / 250));
}

function upgradePerformancePart(vehicleId, part) {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle?.isShowCar || !vehicle.parts) return;
  const cost = getPartUpgradeCost(vehicle, part);
  if (state.auctionCredits < cost) return;
  state.auctionCredits -= cost;
  vehicle.parts[part] += 1;
  vehicle.trueValue = Math.ceil(vehicle.trueValue * 1.08);
  vehicle.estimatedValue = Math.ceil(vehicle.estimatedValue * 1.05);
  updateUI();
}

function enterCarShow(vehicleId) {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle?.isShowCar || state.cash < CAR_SHOW_ENTRY_FEE) return;
  state.cash -= CAR_SHOW_ENTRY_FEE;
  state.carShowEntries = [createShowEntry(vehicle, true)];
  for (let index = 0; index < 7; index += 1) {
    const cpuVehicle = generateShowVehicle();
    cpuVehicle.parts = createPerformanceParts(2, MAX_PART_TIER);
    cpuVehicle.appraised = true;
    state.carShowEntries.push(createShowEntry(cpuVehicle, false));
  }
  state.carShowResults = null;
  updateUI();
}

function createShowEntry(vehicle, isPlayer) {
  return {
    id: isPlayer ? vehicle.id : `cpu-${Date.now()}-${Math.random()}`,
    vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    conditionIndex: vehicle.conditionIndex,
    parts: { ...vehicle.parts },
    trueValue: vehicle.trueValue,
    isPlayer
  };
}

function getCarShowScore(entry) {
  const averagePartTier = PERFORMANCE_PARTS.reduce((sum, part) => sum + (entry.parts?.[part] || 1), 0) / PERFORMANCE_PARTS.length;
  const conditionScore = (entry.conditionIndex + 1) * 12;
  const valueScore = Math.log10(Math.max(10, entry.trueValue)) * 18;
  return averagePartTier * 16 + conditionScore + valueScore + Math.random() * 65;
}

function judgeCarShow() {
  if (state.carShowEntries.length !== 8) return;
  state.carShowResults = [...state.carShowEntries]
    .map((entry) => ({ ...entry, score: getCarShowScore(entry) }))
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, place: index + 1 }));

  const playerResult = state.carShowResults.find((entry) => entry.isPlayer);
  const prize = CAR_SHOW_PRIZES[playerResult.place - 1] || 0;
  state.cash += prize;
  updateUI();
}

function renderBusinessCards() {
  elements.businessGrid.innerHTML = Object.values(STREAMS).filter((stream) => isStreamUnlocked(stream.id)).map((stream) => `
    <article class="business-card" data-business="${stream.id}">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">${stream.shortName}</p>
          <h3>${stream.name}</h3>
        </div>
        <span class="pill" data-owned="${stream.id}">0 owned</span>
      </div>
      <p>${stream.description}</p>
      <div class="metric-grid">
        <div class="metric"><span>Income each</span><strong data-income-each="${stream.id}">$0/s</strong></div>
        <div class="metric"><span>Total income</span><strong data-income-total="${stream.id}">$0/s</strong></div>
        <div class="metric"><span>Next price</span><strong data-price="${stream.id}">$0</strong></div>
        <div class="metric"><span>Owned boost</span><strong data-owned-boost="${stream.id}">x1</strong></div>
      </div>
      <button class="buy-business" data-buy-business="${stream.id}" type="button">Buy ${stream.shortName}</button>
      <div class="bulk-row">
        <button data-buy-bulk="${stream.id}" data-bulk-amount="5" type="button">Buy 5</button>
        <button data-buy-bulk="${stream.id}" data-bulk-amount="10" type="button">Buy 10</button>
        <button data-buy-bulk="${stream.id}" data-bulk-amount="max" type="button">Buy Max</button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-buy-business]").forEach((button) => {
    button.addEventListener("click", () => buyBusiness(button.dataset.buyBusiness));
  });
  document.querySelectorAll("[data-buy-bulk]").forEach((button) => {
    button.addEventListener("click", () => {
      const amount = button.dataset.bulkAmount === "max" ? "max" : Number(button.dataset.bulkAmount);
      buyBusinessBulk(button.dataset.buyBulk, amount);
    });
  });
}

function renderUpgradeTabs() {
  elements.tabs.forEach((tab) => {
    const unlocked = tab.dataset.tab === "all" || isStreamUnlocked(tab.dataset.tab);
    tab.disabled = !unlocked;
    tab.classList.toggle("hidden", !unlocked);
    tab.classList.toggle("active", tab.dataset.tab === activeUpgradeTab);
  });
}

function updateDropdowns() {
  updateDropdown("passiveUpgrades", elements.passiveUpgradesBody, elements.passiveUpgradesToggle);
}

function updateDropdown(key, body, toggle) {
  const isOpen = dropdownState[key];
  body.classList.toggle("collapsed", !isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.textContent = isOpen ? "Hide" : "Show";
}

function toggleDropdown(key) {
  dropdownState[key] = !dropdownState[key];
  updateDropdowns();
}

function showScreen(screen) {
  activeScreen = screen;
  elements.mainScreen.classList.toggle("active", screen === "main");
  elements.prestigeScreen.classList.toggle("active", screen === "prestige");
  elements.auctionScreen.classList.toggle("active", screen === "auction");
  elements.carShowScreen.classList.toggle("active", screen === "carShow");
  elements.screenButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === screen);
  });
}

function renderUpgrades() {
  const visibleUpgrades = getVisibleUpgrades(activeUpgradeTab);

  elements.upgradeGrid.innerHTML = visibleUpgrades.map((upgrade) => {
    const streamId = upgrade.streamId;
    const availableCount = getAvailableUpgradeCount(streamId);
    const purchased = hasUpgrade(streamId, upgrade.id);
    const affordable = state.cash >= upgrade.cost && !purchased;
    const effectText = upgrade.effect.type === "income"
      ? `Income x${upgrade.effect.value.toFixed(2)}`
      : `Future purchases ${Math.round((1 - upgrade.effect.value) * 100)}% cheaper`;
    const cardClasses = ["upgrade-card", purchased ? "purchased" : "", affordable ? "affordable" : ""].join(" ");

    return `
      <article class="${cardClasses}" data-upgrade-card="${upgrade.id}">
        <div>
          <p class="eyebrow">${STREAMS[streamId].shortName} upgrade ${upgrade.tier} of ${availableCount}</p>
          <h3>${upgrade.name}</h3>
          <p>${upgrade.description}</p>
        </div>
        <div class="upgrade-meta">
          <span class="upgrade-cost" data-upgrade-cost="${upgrade.id}">${formatCurrency(upgrade.cost)}</span>
          <p>${effectText}</p>
          <button class="buy-upgrade" data-upgrade="${upgrade.id}" data-upgrade-stream="${streamId}" type="button" ${!affordable ? "disabled" : ""}>Buy Upgrade</button>
        </div>
      </article>
    `;
  }).join("") || `<div class="locked-message">All currently available upgrades for this stream are installed.</div>`;

  document.querySelectorAll("[data-upgrade]").forEach((button) => {
    button.addEventListener("click", () => buyUpgrade(button.dataset.upgradeStream, button.dataset.upgrade));
  });
}

function getVisibleUpgrades(streamId) {
  if (streamId === "all") {
    return Object.keys(STREAMS)
      .filter((id) => isStreamUnlocked(id))
      .flatMap((id) => upgrades[id]
        .slice(0, getAvailableUpgradeCount(id))
        .filter((upgrade) => !hasUpgrade(id, upgrade.id))
        .map((upgrade) => ({ ...upgrade, streamId: id })))
      .sort((a, b) => a.cost - b.cost)
      .slice(0, 3);
  }

  return upgrades[streamId]
    .slice(0, getAvailableUpgradeCount(streamId))
    .filter((upgrade) => !hasUpgrade(streamId, upgrade.id))
    .map((upgrade) => ({ ...upgrade, streamId }))
    .sort((a, b) => a.cost - b.cost)
    .slice(0, 3);
}

function renderPrestigeUpgrades() {
  elements.prestigeUpgradeGrid.innerHTML = PRESTIGE_UPGRADES.map((upgrade) => {
    const purchased = hasPrestigeUpgrade(upgrade.id);
    const affordable = state.prestigeTokens >= upgrade.cost && !purchased;
    return `
      <article class="prestige-upgrade ${purchased ? "purchased" : ""} ${affordable ? "affordable" : ""}" data-prestige-upgrade-card="${upgrade.id}">
        <div>
          <h3>${upgrade.name}</h3>
          <p>${upgrade.description}</p>
        </div>
        <div>
          <span class="upgrade-cost">${purchased ? "Purchased" : `${upgrade.cost} PT`}</span>
          <p>${upgrade.effect}</p>
          <button class="buy-prestige-upgrade" data-prestige-upgrade="${upgrade.id}" type="button" ${purchased || !affordable ? "disabled" : ""}>
            ${purchased ? "Installed" : "Buy"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-prestige-upgrade]").forEach((button) => {
    button.addEventListener("click", () => buyPrestigeUpgrade(button.dataset.prestigeUpgrade));
  });
}

function getPrestigeUpgradeSignature() {
  return `${state.prestigeTokens}|${state.prestigeUpgrades.join(",")}`;
}

function getAuctionRenderSignature() {
  const auction = state.activeAuction;
  const showAuction = state.activeShowAuction;
  const vehicles = state.ownedVehicles.map((vehicle) => [
    vehicle.id,
    vehicle.conditionIndex,
    vehicle.appraised,
    vehicle.trueValue,
    vehicle.estimatedValue,
    vehicle.isShowCar,
    vehicle.parts ? PERFORMANCE_PARTS.map((part) => vehicle.parts[part]).join(".") : ""
  ].join(":")).join("|");
  const auctionPart = auction ? [
    auction.id,
    auction.currentBid,
    auction.highBidder,
    auction.playerReserve,
    auction.message
  ].join(":") : "none";
  const showAuctionPart = showAuction ? [
    showAuction.id,
    showAuction.currentBid,
    showAuction.highBidder,
    showAuction.playerReserve,
    showAuction.message
  ].join(":") : "none";

  return [
    activeAuctionTab,
    Math.floor(state.auctionCredits),
    state.parkingSpaces,
    state.saleMessage,
    auctionPart,
    showAuctionPart,
    isCarShowUnlocked(),
    state.carShowResults ? state.carShowResults.map((entry) => entry.vehicleName + entry.place).join(",") : "",
    vehicles
  ].join("||");
}

function visibleUpgradeListChanged() {
  const renderedIds = [...document.querySelectorAll("[data-upgrade-card]")].map((card) => card.dataset.upgradeCard);
  const visibleIds = getVisibleUpgrades(activeUpgradeTab).map((upgrade) => upgrade.id);
  return renderedIds.length !== visibleIds.length || renderedIds.some((id, index) => id !== visibleIds[index]);
}

function updateUpgradeCards() {
  getVisibleUpgrades(activeUpgradeTab).forEach((upgrade) => {
    const affordable = state.cash >= upgrade.cost && !hasUpgrade(upgrade.streamId, upgrade.id);
    const card = document.querySelector(`[data-upgrade-card="${upgrade.id}"]`);
    const button = document.querySelector(`[data-upgrade="${upgrade.id}"]`);
    if (card) card.classList.toggle("affordable", affordable);
    if (button) button.disabled = !affordable;
  });
}

function renderAuctionViews() {
  ensureActiveAuction();
  renderActiveAuction();
  renderOwnedVehicles();
  elements.activeAuctionView.classList.toggle("hidden", activeAuctionTab !== "auction");
  elements.ownedVehiclesView.classList.toggle("hidden", activeAuctionTab !== "vehicles");
}

function renderCarShow() {
  const unlocked = isCarShowUnlocked();
  elements.carShowUnlockState.textContent = unlocked ? "Unlocked" : `${formatCurrency(state.cash)} / ${formatCurrency(CAR_SHOW_UNLOCK_CASH)}`;
  elements.carShowLocked.classList.toggle("hidden", unlocked);
  elements.carShowContent.classList.toggle("hidden", !unlocked);
  if (!unlocked) return;

  const showCars = state.ownedVehicles.filter((vehicle) => vehicle.isShowCar);
  elements.carShowGarage.innerHTML = `
    <h3>Eligible Show Cars</h3>
    <div class="vehicle-grid">
      ${showCars.map((vehicle) => `
        <article class="vehicle-card">
          <p class="eyebrow">${CONDITIONS[vehicle.conditionIndex].name}</p>
          <h3>${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
          <p>${formatPartLine(vehicle.parts)}. True value matters heavily in judging.</p>
          <button data-enter-show="${vehicle.id}" type="button" ${state.cash < CAR_SHOW_ENTRY_FEE ? "disabled" : ""}>Enter Show - ${formatCurrency(CAR_SHOW_ENTRY_FEE)}</button>
        </article>
      `).join("") || `<div class="locked-message">Buy a Car Show vehicle from the show-car auction to enter competitions.</div>`}
    </div>
  `;

  elements.carShowEntries.innerHTML = renderCarShowEntries();
  document.querySelectorAll("[data-enter-show]").forEach((button) => button.addEventListener("click", () => enterCarShow(button.dataset.enterShow)));
  const judgeButton = document.getElementById("judgeCarShow");
  if (judgeButton) judgeButton.addEventListener("click", judgeCarShow);
}

function renderCarShowEntries() {
  if (!state.carShowEntries.length) return `<div class="locked-message">Enter a show car to generate seven CPU competitors.</div>`;
  const results = state.carShowResults;
  const entries = results || state.carShowEntries;
  return `
    <h3>Entries</h3>
    <div class="vehicle-grid">
      ${entries.map((entry) => `
        <article class="vehicle-card ${entry.isPlayer ? "player-entry" : ""}">
          <p class="eyebrow">${entry.isPlayer ? "Your entry" : "CPU entry"}${entry.place ? ` | Place ${entry.place}` : ""}</p>
          <h3>${entry.vehicleName}</h3>
          <p>${CONDITIONS[entry.conditionIndex].name}. Parts: ${formatPartLine(entry.parts)}. Visible value: ${formatCredits(entry.trueValue)}.</p>
        </article>
      `).join("")}
    </div>
    ${results ? `<div class="notice sale-notice">Your car placed ${results.find((entry) => entry.isPlayer).place}. Prize paid automatically if you finished top 3.</div>` : `<button id="judgeCarShow" type="button">Judge Car Show</button>`}
  `;
}

function renderActiveAuction() {
  if (!isAuctionUnlocked()) {
    elements.activeAuctionView.innerHTML = "";
    return;
  }

  const auction = state.activeAuction;
  const showAuction = isCarShowUnlocked() ? state.activeShowAuction : null;
  const showAuctionHtml = showAuction ? renderAuctionCard(showAuction, "show", "Show Car Auction") : `<div class="locked-message">Car Show auction unlocks at Prestige 2 after reaching ${formatCurrency(CAR_SHOW_UNLOCK_CASH)} cash.</div>`;

  elements.activeAuctionView.innerHTML = `
    ${renderAuctionCard(auction, "standard", "Dealer Auction")}
    ${showAuctionHtml}
  `;

  document.querySelectorAll("[data-place-bid]").forEach((button) => button.addEventListener("click", () => placeAuctionBid(button.dataset.placeBid)));
  document.querySelectorAll("[data-skip-auction]").forEach((button) => button.addEventListener("click", () => skipAuction(button.dataset.skipAuction)));
}

function renderAuctionCard(auction, auctionType, title) {
  const condition = CONDITIONS[auction.conditionIndex].name;
  const nextBid = Math.ceil(auction.currentBid + Math.max(1, auction.trueValue * 0.08));
  const parts = auction.isShowCar ? `<p class="parts-line">${formatPartLine(auction.parts)}</p>` : "";

  return `
    <div class="auction-card">
      <div>
        <p class="eyebrow">${title}</p>
        <h3>${auction.year} ${auction.make} ${auction.model}</h3>
        <p>${auction.message}</p>
        ${parts}
      </div>
      <div class="metric-grid auction-metrics">
        <div class="metric"><span>MSRP when new</span><strong>${formatCredits(auction.msrp)}</strong></div>
        <div class="metric"><span>Condition</span><strong>${condition}</strong></div>
        <div class="metric"><span>Estimated value</span><strong>${formatCredits(auction.estimatedValue)}</strong></div>
        <div class="metric"><span>Starting bid</span><strong>${formatCredits(auction.startingBid)}</strong></div>
        <div class="metric"><span>Current bid</span><strong>${formatCredits(auction.currentBid)}</strong></div>
        <div class="metric"><span>High bidder</span><strong>${auction.highBidder}</strong></div>
      </div>
      <div class="auction-actions">
        <button data-place-bid="${auctionType}" type="button">Bid ${formatCredits(nextBid)}</button>
        <button data-skip-auction="${auctionType}" class="ghost-button" type="button">Skip Vehicle</button>
      </div>
    </div>
  `;
}

function formatPartLine(parts) {
  return PERFORMANCE_PARTS.map((part) => `${capitalize(part)} T${parts?.[part] || 1}`).join(" | ");
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderOwnedVehicles() {
  if (!isAuctionUnlocked()) {
    elements.ownedVehiclesView.innerHTML = "";
    return;
  }

  const vehicleCards = state.ownedVehicles.map((vehicle) => {
    const condition = CONDITIONS[vehicle.conditionIndex].name;
    const appraisalCost = getAppraisalCost(vehicle);
    const conditionCost = getConditionUpgradeCost(vehicle);
    const canUpgrade = vehicle.conditionIndex < CONDITIONS.length - 1;
    const partControls = vehicle.isShowCar ? `
      <div class="part-grid">
        ${PERFORMANCE_PARTS.map((part) => {
          const cost = getPartUpgradeCost(vehicle, part);
          const tier = vehicle.parts?.[part] || 1;
          return `<button data-part="${part}" data-part-vehicle="${vehicle.id}" type="button" ${tier >= MAX_PART_TIER || state.auctionCredits < cost ? "disabled" : ""}>${capitalize(part)} T${tier} - ${tier >= MAX_PART_TIER ? "Max" : formatCredits(cost)}</button>`;
        }).join("")}
      </div>
    ` : "";
    return `
      <article class="vehicle-card">
        <div>
          <p class="eyebrow">${vehicle.isShowCar ? "Car Show Vehicle" : condition}</p>
          <h3>${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
          <p>${condition}. Estimated value: ${formatCredits(vehicle.estimatedValue)}. ${vehicle.appraised ? `True value: ${formatCredits(vehicle.trueValue)}.` : "True value hidden until appraised."}</p>
          ${vehicle.isShowCar ? `<p>Parts: ${formatPartLine(vehicle.parts)}. Sale bonus x${getShowCarSaleMultiplier(vehicle).toFixed(2)}.</p>` : ""}
        </div>
        ${partControls}
        <div class="vehicle-actions">
          <button data-appraise="${vehicle.id}" type="button" ${vehicle.appraised || state.auctionCredits < appraisalCost ? "disabled" : ""}>Appraise ${formatCredits(appraisalCost)}</button>
          <button data-condition="${vehicle.id}" type="button" ${!canUpgrade || state.auctionCredits < conditionCost ? "disabled" : ""}>Improve ${canUpgrade ? formatCredits(conditionCost) : "Max"}</button>
          <button data-instant-sale="${vehicle.id}" type="button" ${!vehicle.appraised ? "disabled" : ""}>Instant Sell</button>
          <button data-auction-sale="${vehicle.id}" type="button">Auction Sale</button>
        </div>
      </article>
    `;
  }).join("");

  elements.ownedVehiclesView.innerHTML = `
    ${state.saleMessage ? `<div class="notice sale-notice">${state.saleMessage}</div>` : ""}
    <div class="parking-line">${getUsedParkingSpaces()} of ${state.parkingSpaces} parking spaces used.</div>
    <div class="vehicle-grid">${vehicleCards || `<div class="locked-message">No auction vehicles owned yet.</div>`}</div>
  `;

  document.querySelectorAll("[data-appraise]").forEach((button) => button.addEventListener("click", () => appraiseVehicle(button.dataset.appraise)));
  document.querySelectorAll("[data-condition]").forEach((button) => button.addEventListener("click", () => upgradeVehicleCondition(button.dataset.condition)));
  document.querySelectorAll("[data-instant-sale]").forEach((button) => button.addEventListener("click", () => instantSellVehicle(button.dataset.instantSale)));
  document.querySelectorAll("[data-auction-sale]").forEach((button) => button.addEventListener("click", () => auctionSellVehicle(button.dataset.auctionSale)));
  document.querySelectorAll("[data-part]").forEach((button) => button.addEventListener("click", () => upgradePerformancePart(button.dataset.partVehicle, button.dataset.part)));
}

function updateUI() {
  const leasedCarCost = getLeasedCarCost();
  const clickValue = getClickValue();
  const incomePerSecond = getTotalIncomePerSecond();
  const requirement = getPrestigeRequirement();
  const prestigeReady = canPrestige();
  const auctionUnlocked = isAuctionUnlocked();
  if (state.prestige >= 2 && state.cash >= CAR_SHOW_UNLOCK_CASH) {
    state.carShowUnlocked = true;
  }

  elements.cash.textContent = formatCurrency(state.cash);
  elements.auctionCredits.textContent = formatCredits(state.auctionCredits);
  elements.prestigeLevel.textContent = state.prestige.toLocaleString();
  elements.prestigeTokens.textContent = `${state.prestigeTokens.toLocaleString()} PT`;
  elements.prestigeTokenPill.textContent = `${state.prestigeTokens.toLocaleString()} PT`;
  elements.prestigeBonus.textContent = `+${Math.round(state.prestige * PRESTIGE_INCOME_BONUS * 100)}%`;
  elements.incomePerSecond.textContent = `${formatCurrency(incomePerSecond)}/s`;
  elements.carsOwned.textContent = formatQuantity(state.leasedCars, "car");
  elements.clickValue.textContent = `${formatCurrency(clickValue)} per click`;
  elements.leasedCarPrice.textContent = formatCurrency(leasedCarCost);
  elements.buyLeasedCar.classList.toggle("affordable", state.cash >= leasedCarCost);

  Object.keys(STREAMS).forEach((streamId) => {
    if (!isStreamUnlocked(streamId)) return;
    const cost = getBusinessCost(streamId);
    const owned = state.businesses[streamId].owned;
    setText(`[data-owned="${streamId}"]`, `${owned.toLocaleString()} owned`);
    setText(`[data-income-each="${streamId}"]`, `${formatCurrency(getBusinessIncomeEach(streamId))}/s`);
    setText(`[data-income-total="${streamId}"]`, `${formatCurrency(getBusinessIncomeTotal(streamId))}/s`);
    setText(`[data-price="${streamId}"]`, formatCurrency(cost));
    setText(`[data-owned-boost="${streamId}"]`, `x${getOwnershipMilestoneMultiplier(streamId).toLocaleString()}`);
    const button = document.querySelector(`[data-buy-business="${streamId}"]`);
    if (button) {
      button.textContent = `Buy ${STREAMS[streamId].shortName} - ${formatCurrency(cost)}`;
      button.classList.toggle("affordable", state.cash >= cost);
    }
    document.querySelectorAll(`[data-buy-bulk="${streamId}"]`).forEach((bulkButton) => {
      bulkButton.classList.toggle("affordable", state.cash >= cost);
      bulkButton.disabled = state.cash < cost;
    });
  });

  elements.buyAllPassiveUpgrades.disabled = !hasAnyAffordablePassiveUpgrade();

  elements.prestigeDescription.textContent = `Next prestige: Level ${requirement.nextPrestige}, +${requirement.nextPrestige} PT.`;
  elements.prestigeRequirements.innerHTML = `
    <div class="${state.cash >= requirement.cash ? "met" : ""}">Cash: ${formatCurrency(state.cash)} / ${formatCurrency(requirement.cash)}</div>
    <div class="${state.auctionCredits >= requirement.auctionCredits ? "met" : ""}">Auction Credits: ${formatCredits(state.auctionCredits)} / ${formatCredits(requirement.auctionCredits)}</div>
  `;
  elements.prestigeButton.disabled = !prestigeReady;
  elements.prestigeButton.classList.toggle("ready", prestigeReady);
  elements.prestigeButton.textContent = `Prestige to Level ${requirement.nextPrestige}`;

  elements.auctionUnlockState.textContent = auctionUnlocked ? "Unlocked" : `${state.businesses.newDealerships.owned}/${AUCTION_HOUSE_DEALERSHIP_REQUIREMENT} New Car Dealers`;
  elements.auctionLocked.classList.toggle("hidden", auctionUnlocked);
  elements.auctionContent.classList.toggle("hidden", !auctionUnlocked);
  elements.auctionCreditsPanel.textContent = formatCredits(state.auctionCredits);
  elements.parkingStatus.textContent = `${getUsedParkingSpaces()} / ${state.parkingSpaces} used`;
  elements.convertCashToCredits.disabled = state.cash < CASH_TO_AUCTION_CREDIT || !auctionUnlocked;
  elements.convertCreditsToCash.disabled = state.auctionCredits < 1 || !auctionUnlocked;
  elements.buyParking.disabled = state.auctionCredits < getParkingCost() || !auctionUnlocked;
  elements.buyParking.textContent = `Buy Parking - ${formatCredits(getParkingCost())}`;
  renderCarShow();

  const prestigeUpgradeSignature = getPrestigeUpgradeSignature();
  if (prestigeUpgradeSignature !== lastPrestigeUpgradeSignature) {
    renderPrestigeUpgrades();
    lastPrestigeUpgradeSignature = prestigeUpgradeSignature;
  }
  renderUpgradeTabs();
  if (visibleUpgradeListChanged()) renderUpgrades();
  updateUpgradeCards();

  if (auctionUnlocked) ensureActiveAuction();
  const auctionSignature = getAuctionRenderSignature();
  if (auctionSignature !== lastAuctionSignature) {
    renderAuctionViews();
    lastAuctionSignature = auctionSignature;
  }
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function saveGame(message = "Saved") {
  state.lastSaved = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  elements.saveStatus.textContent = `${message} ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function loadGame() {
  const rawSave = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY);
  if (!rawSave) return;

  try {
    const saved = JSON.parse(rawSave);
    state.cash = Number(saved.cash) || 0;
    state.prestige = Number(saved.prestige) || 0;
    state.prestigeTokens = Number(saved.prestigeTokens) || 0;
    state.prestigeUpgrades = Array.isArray(saved.prestigeUpgrades) ? saved.prestigeUpgrades.filter((id) => PRESTIGE_UPGRADES.some((upgrade) => upgrade.id === id)) : [];
    state.leasedCars = Math.max(1, Number(saved.leasedCars) || 1);
    state.auctionCredits = Number(saved.auctionCredits) || 0;
    state.reservedAuctionCredits = Number(saved.reservedAuctionCredits) || 0;
    state.parkingSpaces = Math.max(1, Number(saved.parkingSpaces) || 1);
    state.ownedVehicles = Array.isArray(saved.ownedVehicles) ? saved.ownedVehicles : [];
    state.activeAuction = saved.activeAuction || null;
    state.activeShowAuction = saved.activeShowAuction || null;
    state.carShowUnlocked = Boolean(saved.carShowUnlocked);
    state.carShowEntries = Array.isArray(saved.carShowEntries) ? saved.carShowEntries : [];
    state.carShowResults = Array.isArray(saved.carShowResults) ? saved.carShowResults : null;
    state.saleMessage = saved.saleMessage || "";

    Object.keys(STREAMS).forEach((streamId) => {
      const savedBusiness = saved.businesses?.[streamId] || {};
      state.businesses[streamId] = {
        owned: Math.max(0, Number(savedBusiness.owned) || 0),
        purchasedUpgrades: Array.isArray(savedBusiness.purchasedUpgrades)
          ? savedBusiness.purchasedUpgrades.filter((id) => upgrades[streamId].some((upgrade) => upgrade.id === id))
          : []
      };
    });

    state.lastSaved = Number(saved.lastSaved) || Date.now();
    applyOfflineEarnings();
  } catch (error) {
    console.warn("Could not load save", error);
  }
}

function applyOfflineEarnings() {
  const elapsed = Math.max(0, Date.now() - state.lastSaved);
  const cappedElapsed = Math.min(elapsed, OFFLINE_CAP_MS);
  const earned = getTotalIncomePerSecond() * (cappedElapsed / 1000);

  if (earned >= 1) {
    state.cash += earned;
    elements.offlineNotice.textContent = `Welcome back. Your businesses earned ${formatCurrency(earned)} while you were away.`;
    elements.offlineNotice.classList.remove("hidden");
    setTimeout(() => elements.offlineNotice.classList.add("hidden"), 9000);
  }
}

function resetSave() {
  const confirmed = window.confirm("Reset your Car Dealer Empire save? This cannot be undone.");
  if (!confirmed) return;

  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(LEGACY_SAVE_KEY);
  state.cash = 0;
  state.prestige = 0;
  state.prestigeTokens = 0;
  state.prestigeUpgrades = [];
  state.leasedCars = 1;
  state.businesses = createFreshBusinesses();
  state.auctionCredits = 0;
  state.reservedAuctionCredits = 0;
  state.parkingSpaces = 1;
  state.ownedVehicles = [];
  state.activeAuction = null;
  state.activeShowAuction = null;
  state.carShowUnlocked = false;
  state.carShowEntries = [];
  state.carShowResults = null;
  state.saleMessage = "";
  state.lastSaved = Date.now();
  activeUpgradeTab = "all";
  elements.offlineNotice.classList.add("hidden");
  renderBusinessCards();
  renderUpgradeTabs();
  renderUpgrades();
  saveGame("Reset saved");
  updateUI();
}

function gameLoop() {
  const now = Date.now();
  const deltaSeconds = (now - lastTick) / 1000;
  lastTick = now;
  state.cash += getTotalIncomePerSecond() * deltaSeconds;

  if (now - lastSave >= SAVE_INTERVAL_MS) {
    saveGame();
    lastSave = now;
  }

  updateUI();
  requestAnimationFrame(gameLoop);
}

function bindEvents() {
  elements.collectButton.addEventListener("click", () => {
    state.cash += getClickValue();
    updateUI();
  });

  elements.buyLeasedCar.addEventListener("click", buyLeasedCar);
  elements.prestigeButton.addEventListener("click", prestige);
  elements.resetSave.addEventListener("click", resetSave);
  elements.passiveUpgradesToggle.addEventListener("click", () => toggleDropdown("passiveUpgrades"));
  elements.buyAllPassiveUpgrades.addEventListener("click", buyAllAffordablePassiveUpgrades);
  elements.convertCashToCredits.addEventListener("click", convertCashToCredits);
  elements.convertCreditsToCash.addEventListener("click", convertCreditsToCash);
  elements.buyParking.addEventListener("click", buyParking);

  elements.screenButtons.forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.screen));
  });

  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.dataset.tab !== "all" && !isStreamUnlocked(tab.dataset.tab)) return;
      activeUpgradeTab = tab.dataset.tab;
      renderUpgradeTabs();
      renderUpgrades();
    });
  });

  elements.auctionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeAuctionTab = tab.dataset.auctionTab;
      elements.auctionTabs.forEach((item) => item.classList.toggle("active", item === tab));
      elements.activeAuctionView.classList.toggle("hidden", activeAuctionTab !== "auction");
      elements.ownedVehiclesView.classList.toggle("hidden", activeAuctionTab !== "vehicles");
    });
  });

  window.addEventListener("beforeunload", () => saveGame("Saved"));
}

function init() {
  bindEvents();
  loadGame();
  if (activeUpgradeTab !== "all" && !isStreamUnlocked(activeUpgradeTab)) activeUpgradeTab = "all";
  renderBusinessCards();
  renderPrestigeUpgrades();
  lastPrestigeUpgradeSignature = getPrestigeUpgradeSignature();
  renderUpgradeTabs();
  renderUpgrades();
  updateDropdowns();
  showScreen(activeScreen);
  updateUI();
  requestAnimationFrame(gameLoop);
}

init();
