<template>
  <div class="design-planner flex flex-col bg-slate-50 text-slate-800 font-extralight tracking-wider select-none overflow-hidden rounded-[2.5rem] border border-slate-200/60 shadow-xl">
    
    <div class="flex flex-col md:flex-row p-4 md:p-6 gap-6 h-auto md:h-[75vh]">
      
      <!-- Left: Interactive Canvas -->
      <div class="w-full md:w-[72%] flex flex-col bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <header class="px-8 py-4 flex justify-between items-center border-b border-slate-100 bg-white/80 backdrop-blur-md z-10 shrink-0">
          <div>
            <h1 class="text-xl font-thin text-slate-900 italic tracking-tighter flex items-center gap-2">
              {{ $t('planner.title') }}
              <span class="text-[9px] not-italic font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Pro</span>
            </h1>
            <p class="text-slate-400 text-[9px] uppercase tracking-[0.2em]">Smart Link: Tag to List</p>
          </div>
          <div class="flex gap-2">
            <button 
              @click="undo" :disabled="!hasUndo"
              class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-400 rounded-full hover:bg-slate-50 transition-all text-xs disabled:opacity-20 shadow-sm"
            >
              <RotateCcwIcon :size="12" /> {{ $t('planner.undo') }}
            </button>
            <button @click="addNewRoom" class="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md text-xs font-normal tracking-widest">
              <PlusCircleIcon :size="14" /> {{ $t('planner.addRoom') }}
            </button>
          </div>
        </header>

        <div 
          id="map-container" 
          @click="handleContainerClick"
          class="flex-1 relative m-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-200/50 overflow-hidden shadow-inner"
        >
          <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(#64748b 1.5px, transparent 1.5px); background-size: 30px 30px;" />
          
          <svg class="absolute inset-0 w-full h-full pointer-events-none">
            <g v-for="room in (Object.values(rooms) as any[])" :key="(room as any).id" class="pointer-events-auto">
              <polygon
                :points="getPointsStr(room.points)"
                :fill="room.bgColor"
                :fill-opacity="activeRoom === room.id ? 0.5 : (hoveredRoom === room.id ? 0.65 : 0.8)"
                :stroke="activeRoom === room.id ? '#3b82f6' : (hoveredRoom === room.id ? 'rgba(59, 130, 246, 0.75)' : 'transparent')"
                :stroke-width="activeRoom === room.id || hoveredRoom === room.id ? 3 : 0"
                class="transition-all duration-200 cursor-move"
                @mouseenter="hoveredRoom = room.id"
                @mouseleave="hoveredRoom = null"
                @mousedown.stop="handleRoomMouseDown(room.id, $event)"
              />
              <foreignObject :x="getPolygonCenter(room.points).x - 60" :y="getPolygonCenter(room.points).y - 15" width="120" height="30" class="pointer-events-none">
                <div class="flex items-center justify-center h-full">
                  <span class="text-[11px] font-light tracking-[0.2em] text-center drop-shadow-sm" :style="{ color: room.textColor, opacity: activeRoom === room.id || hoveredRoom === room.id ? 1 : 0.7 }">
                    {{ room.name }}
                  </span>
                </div>
              </foreignObject>

              <template v-if="activeRoom === room.id">
                <g>
                  <circle
                    v-for="(p, idx) in ((room as any).points as any[])" :key="`anchor-${idx}`"
                    :cx="(p as any).x" :cy="(p as any).y" :r="selectedAnchorIndices.includes(idx) ? 7 : 5"
                    :fill="selectedAnchorIndices.includes(idx) ? '#3b82f6' : 'white'"
                    stroke="#3b82f6" stroke-width="2" style="cursor: crosshair"
                    @mousedown.stop="handleAnchorMouseDown((room as any).id, idx, $event)"
                  />
                  <circle
                    v-for="(p, idx) in ((room as any).points as any[])" :key="`mid-${idx}`"
                    :cx="((p as any).x + (room as any).points[(idx + 1) % (room as any).points.length].x) / 2"
                    :cy="((p as any).y + (room as any).points[(idx + 1) % (room as any).points.length].y) / 2"
                    r="3"
                    fill="#bfdbfe" class="cursor-pointer opacity-40 hover:opacity-100 transition-all"
                    @mousedown.stop="addAnchor((room as any).id, idx, $event)"
                  />
                </g>
              </template>
            </g>
          </svg>

          <div
            v-for="item in placedItems" :key="item.id"
            @mousedown.stop="handleItemMouseDown(item.id, $event)"
            class="absolute cursor-move z-30 px-3 py-1 rounded-full border bg-white shadow-lg flex items-center gap-2 transition-transform"
            :class="{ 'ring-2 ring-blue-500 scale-110': activeItem === item.id, 'hover:scale-105': activeItem !== item.id }"
            :style="{ left: item.x + 'px', top: item.y + 'px', transition: dragging?.id === item.id ? 'none' : 'transform 0.2s ease-out' }"
          >
            <PackageIcon :size="10" class="text-blue-500" />
            <span class="text-[9px] font-normal whitespace-nowrap tracking-tighter">{{ item.name }}</span>
          </div>
        </div>

        <footer class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-6 shrink-0">
          <div class="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
            <div class="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
            {{ $t('planner.deviceList') }}
          </div>
        </footer>
      </div>

      <!-- Right: Management Panel -->
      <div class="w-full md:w-[28%] flex flex-col bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div class="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
          <div v-if="showSummary" class="animate-in">
            <div class="flex items-center gap-3 mb-6">
              <ShieldCheckIcon class="w-5 h-5 text-blue-500" />
              <h2 class="text-lg font-thin text-slate-900 tracking-widest uppercase">{{ $t('planner.budgetSummary') }}</h2>
            </div>
            <div class="space-y-2 mb-6">
              <div v-for="[name, count] in summaryData.list" :key="name" class="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-[11px] font-light">{{ name }}</span>
                <span class="text-[11px] font-bold px-2 py-0.5 bg-white rounded-lg shadow-sm border border-slate-100">x {{ count }}</span>
              </div>
            </div>
            <div class="p-6 bg-slate-900 text-white rounded-[1.5rem] shadow-xl">
              <p class="text-[9px] opacity-40 uppercase tracking-[0.2em] mb-1">{{ $t('planner.budgetEstimated') }}</p>
              <p class="text-2xl font-thin tracking-tighter">NT$ {{ summaryData.total.toLocaleString() }}</p>
            </div>
            <button @click="showSummary = false" class="w-full mt-6 py-3 border border-slate-100 rounded-xl text-[10px] text-slate-400 hover:text-slate-600 tracking-[0.3em] uppercase transition-all font-bold">{{ $t('backToHome') }}</button>
          </div>

          <div v-else-if="currentRoom" class="animate-in">
            <div class="mb-6 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 text-slate-500">{{ $t('planner.roomSettings') }}</h3>
                <button v-if="activeRoom" @click="deleteRoom(activeRoom)" class="text-red-400 hover:text-red-600 transition-colors"><Trash2Icon :size="12"/></button>
              </div>
              <input 
                type="text" v-model="currentRoom.name" 
                class="w-full bg-white border-none rounded-xl px-4 py-2 text-xs font-light mb-3 shadow-sm focus:ring-1 focus:ring-blue-100 transition-all" 
              />
              <input 
                type="color" v-model="currentRoom.bgColor" 
                class="w-full h-8 rounded-lg cursor-pointer bg-transparent border-none shadow-sm" 
              />
            </div>

            <div class="flex items-center justify-between mb-6">
               <div class="flex items-center gap-3">
                 <div class="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
                   <component :is="IconMap[currentRoom.icon] || LayoutIcon" :size="16" />
                 </div>
                 <h2 class="text-lg font-thin tracking-widest leading-none">{{ currentRoom.name }}</h2>
               </div>
               <button @click="clearRoomDevices" class="text-[9px] text-slate-400 font-bold uppercase tracking-widest hover:text-red-500 transition-colors">{{ $t('planner.clear') }}</button>
            </div>

            <div class="mb-6 p-4 bg-blue-50/50 rounded-[1.5rem] border border-blue-100 shadow-sm">
              <p class="text-[9px] font-bold text-blue-500 uppercase mb-3 tracking-widest">{{ $t('planner.addDevice') }}</p>
              <div class="flex gap-2">
                <input 
                  type="text" v-model="newDeviceName" 
                  @keyup.enter="addNewDevice"
                  placeholder="設備名稱..." class="flex-1 bg-white border-none rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-200 shadow-sm" 
                />
                <button @click="addNewDevice" class="p-2.5 bg-blue-600 text-white rounded-xl shadow-md"><PlusIcon :size="16"/></button>
              </div>
            </div>

            <h3 class="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-3 px-2 text-slate-500">{{ $t('planner.deviceList') }}</h3>
            <div class="space-y-2 pb-8 overflow-y-auto max-h-[30vh]">
              <div v-for="(dev, idx) in currentRoom.devices" :key="idx" class="p-3.5 rounded-xl border border-slate-100 bg-[#fdfdfd] shadow-sm group hover:border-blue-200 transition-all">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <input type="text" v-model="dev.name" class="w-full bg-transparent border-none p-0 text-[11px] font-light text-slate-800 focus:ring-0" />
                    <input type="text" v-model="dev.note" class="w-full bg-transparent border-none p-0 text-[9px] font-light text-slate-400 focus:ring-0" />
                  </div>
                  <button @click="removeDevice(idx)" class="text-red-200 hover:text-red-500 p-1"><Trash2Icon :size="12"/></button>
                </div>
              </div>
              <p v-if="currentRoom.devices.length === 0" class="text-[10px] text-slate-300 text-center py-4 italic">{{ $t('planner.emptyRoom') }}</p>
            </div>
          </div>

          <div v-else-if="activeItemData" class="animate-in">
             <div class="flex items-center gap-4 mb-6">
              <div class="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-xl"><PackageIcon :size="22"/></div>
              <div>
                <h2 class="text-xl font-thin text-slate-900 tracking-widest uppercase mb-1">{{ activeItemData.name }}</h2>
                <p class="text-blue-600 text-[11px] font-bold">NT$ {{ activeItemData.price.toLocaleString() }}</p>
              </div>
            </div>
            <button @click="removeItemTag" class="w-full py-4 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-100 transition-all text-[11px] font-bold tracking-[0.2em] shadow-sm"><Trash2Icon :size="14" /> {{ $t('planner.removeTag') }}</button>
          </div>

          <div v-else class="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
            <MousePointer2Icon class="w-16 h-16 mb-6 text-slate-300 stroke-[0.5px]" />
            <p class="text-slate-500 text-[10px] font-light tracking-[0.2em] uppercase leading-loose">點擊畫布空間或標籤<br/>展開管理面板</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom: Product Catalog -->
    <div class="mx-6 mb-6 p-6 md:p-10 bg-white rounded-[2rem] shadow-sm border border-slate-100 h-[40vh] flex flex-col overflow-hidden shrink-0">
      <header class="mb-6 flex items-center gap-5 shrink-0 border-b border-slate-50 pb-4">
        <div class="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem] shadow-inner"><ShoppingCartIcon :size="24"/></div>
        <div>
          <h2 class="text-xl font-thin text-slate-900 tracking-tighter uppercase italic">Product Catalog</h2>
          <p class="text-slate-400 text-[9px] uppercase tracking-[0.3em] font-bold">Marketplace</p>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="cat in productCatalog" :key="cat.category" class="space-y-3 text-left">
            <button @click="toggleCategory(cat.category)" class="w-full flex items-center justify-between group py-2 border-b border-slate-100 transition-all hover:border-blue-500">
              <h3 class="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">{{ cat.category }}</h3>
              <div class="text-slate-300 transition-transform duration-500" :class="{ 'rotate-0': expandedCategories[cat.category], '-rotate-180': !expandedCategories[cat.category] }">
                <ChevronDownIcon :size="14" />
              </div>
            </button>
            <div v-if="expandedCategories[cat.category]" class="flex flex-col gap-2 animate-in">
              <button v-for="item in cat.items" :key="item.name" @click="addProductToMap(item)" class="group flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-400 hover:shadow-lg transition-all text-left">
                <div class="flex flex-col">
                  <span class="text-[11px] font-light text-slate-800 group-hover:text-blue-600">{{ item.name }}</span>
                  <span class="text-[9px] font-bold text-slate-400 mt-0.5">NT$ {{ item.price.toLocaleString() }}</span>
                </div>
                <div class="p-1.5 bg-white rounded-full shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all"><PlusIcon :size="12" /></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-8 right-8 z-50">
      <button @click="showSummary = true" class="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] text-[10px] font-bold tracking-[0.4em] uppercase hover:scale-105 active:scale-95">
        <DollarSignIcon :size="16" /> 預算總結
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { 
  HomeIcon, ShieldCheckIcon, WifiIcon, DropletsIcon, WindIcon, ScanFaceIcon, SettingsIcon, InfoIcon,
  ActivityIcon, MaximizeIcon, MoveIcon, ChevronRightIcon, ChevronDownIcon, PaletteIcon, TypeIcon,
  SquareIcon, LayoutIcon, PlusIcon, Trash2Icon, PlusCircleIcon, DollarSignIcon,
  ShoppingCartIcon, PackageIcon, Edit3Icon, MousePointer2Icon, RotateCcwIcon
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const IconMap: any = {
  Home: HomeIcon, ScanFace: ScanFaceIcon, Droplets: DropletsIcon,
  Wind: WindIcon, Wifi: WifiIcon, Activity: ActivityIcon,
  Settings: SettingsIcon, Layout: LayoutIcon
};

// --- Core State ---
const rooms = ref<any>({
  entrance: { 
    id: "entrance", name: "玄關", points: [{x:50,y:30}, {x:150,y:30}, {x:150,y:130}, {x:50,y:130}],
    bgColor: '#dbeafe', textColor: '#1e3a8a', icon: "ScanFace",
    devices: [{ name: "人臉辨識智能門鎖", note: "預設" }, { name: "智能開關", note: "預設" }, { name: "紅外線感測器", note: "預設" }, { name: "智能燈具", note: "預設" }]
  },
  living: { 
    id: "living", name: "客廳", points: [{x:160,y:30}, {x:360,y:30}, {x:360,y:230}, {x:160,y:230}],
    bgColor: '#ffedd5', textColor: '#7c2d12', icon: "Home",
    devices: [{ name: "智能開關", note: "預設" }, { name: "智能燈具", note: "預設" }, { name: "智能氛圍燈條", note: "預設" }]
  },
  kitchen: { 
    id: "kitchen", name: "廚房", points: [{x:370,y:30}, {x:520,y:30}, {x:520,y:150}, {x:370,y:150}],
    bgColor: '#fee2e2', textColor: '#7f1d1d', icon: "Droplets",
    devices: [{ name: "智能開關", note: "預設" }, { name: "智能煙霧感測器", note: "預設" }, { name: "智能天然氣閥", note: "預設" }, { name: "智能水閥", note: "預設" }, { name: "智能燈具", note: "預設" }]
  },
  backBalcony: {
    id: "backBalcony", name: "後陽台", points: [{x:530,y:30}, {x:630,y:30}, {x:630,y:130}, {x:530,y:130}],
    bgColor: '#fefce8', textColor: '#854d0e', icon: "Wind",
    devices: [{ name: "紅外線感測器", note: "預設" }, { name: "智能燈具", note: "預設" }]
  },
  frontBalcony: {
    id: "frontBalcony", name: "前陽台", points: [{x:640,y:30}, {x:740,y:30}, {x:740,y:130}, {x:640,y:130}],
    bgColor: '#fefce8', textColor: '#854d0e', icon: "Wind",
    devices: [{ name: "紅外線感測器", note: "預設" }, { name: "智能燈具", note: "預設" }]
  },
  study: {
    id: "study", name: "書房", points: [{x:50,y:140}, {x:150,y:140}, {x:150,y:240}, {x:50,y:240}],
    bgColor: '#e0e7ff', textColor: '#1e1b4b', icon: "Wifi",
    devices: [{ name: "智能燈具", note: "預設" }, { name: "智能開關", note: "預設" }, { name: "zigbee網關", note: "預設" }, { name: "wifi路由器", note: "預設" }]
  },
  guestBath: {
    id: "guestBath", name: "客浴", points: [{x:370,y:160}, {x:470,y:160}, {x:470,y:260}, {x:370,y:260}],
    bgColor: '#ccfbf1', textColor: '#134e4a', icon: "Droplets",
    devices: [{ name: "智能水閥", note: "預設" }, { name: "人存在感測器", note: "預設" }, { name: "智能開關", note: "預設" }, { name: "智能燈具", note: "預設" }]
  },
  masterBath: {
    id: "masterBath", name: "主浴", points: [{x:480,y:160}, {x:580,y:160}, {x:580,y:260}, {x:480,y:260}],
    bgColor: '#ccfbf1', textColor: '#134e4a', icon: "Droplets",
    devices: [{ name: "智能水閥", note: "預設" }, { name: "人存在感測器", note: "預設" }, { name: "智能開關", note: "預設" }, { name: "智能燈具", note: "預設" }]
  },
  masterBedroom: { 
    id: "masterBedroom", name: "主臥室", points: [{x:50,y:250}, {x:250,y:250}, {x:250,y:400}, {x:50,y:400}],
    bgColor: '#f3e8ff', textColor: '#581c87', icon: "Activity",
    devices: [{ name: "智能燈具", note: "預設" }, { name: "智能開關", note: "預設" }, { name: "智能氛圍燈條", note: "預設" }]
  },
  kidsRoom: { 
    id: "kidsRoom", name: "小孩房", points: [{x:260,y:250}, {x:460,y:250}, {x:460,y:400}, {x:260,y:400}],
    bgColor: '#dcfce7', textColor: '#064e3b', icon: "Settings",
    devices: [{ name: "智能燈具", note: "預設" }, { name: "智能開關", note: "預設" }, { name: "智能氛圍燈條", note: "預設" }]
  }
});

const placedItems = ref<any[]>([]);

// --- UI & Interaction State ---
const activeRoom = ref<string | null>(null);
const hoveredRoom = ref<string | null>(null);
const activeItem = ref<string | null>(null);
const showSummary = ref(false);
const newDeviceName = ref('');
const isCtrlPressed = ref(false);
const selectedAnchorIndices = ref<number[]>([]);
const expandedCategories = ref<any>({});
const dragging = ref<any>(null);
const resizing = ref<any>(null);
const dragStart = ref({ x: 0, y: 0 });

// --- History/Undo ---
const history = ref<string[]>([]);
const hasUndo = computed(() => history.value.length > 1);

const saveHistory = () => {
  const snapshot = JSON.stringify({ rooms: rooms.value, placedItems: placedItems.value });
  if (history.value.length > 0 && history.value[history.value.length - 1] === snapshot) return;
  history.value.push(snapshot);
  if (history.value.length > 50) history.value.shift();
};

const undo = () => {
  if (history.value.length <= 1) return;
  history.value.pop();
  const prevState = JSON.parse(history.value[history.value.length - 1]);
  rooms.value = prevState.rooms;
  placedItems.value = prevState.placedItems;
  activeRoom.value = null;
  activeItem.value = null;
  selectedAnchorIndices.value = [];
};

// --- Product Catalog ---
const productCatalog = [
  { category: "智能燈具類", items: [{ name: "擴散燈", price: 650 }, { name: "設燈", price: 880 }, { name: "筒燈", price: 900 }, { name: "COB燈條", price: 1750 }, { name: "燈泡", price: 350 }, { name: "軌道燈", price: 980 }, { name: "磁吸軌道燈", price: 1300 }] },
  { category: "空調控制類", items: [ { name: "空調控制器", price: 1500 } ] },
  { category: "電動智能窗簾類", items: [{ name: "電動捲簾/調光簾", price: 8000 }, { name: "電動開合簾", price: 8800 }, { name: "電動蛇行簾", price: 9500 }, { name: "電動直立沙簾", price: 12000 }] },
  { category: "環境控制系統類", items: [{ name: "全熱交換器控制", price: 5500 }, { name: "除濕機控制", price: 5500 }, { name: "衛浴暖風機控制", price: 3500 }, { name: "清淨機控制", price: 3500 }, { name: "掃地機控制", price: 3500 }] },
  { category: "安全防護類", items: [{ name: "控制大門對講機", price: 3500 }, { name: "電子智能門鎖", price: 8500 }, { name: "無線監視器", price: 1500 }] },
  { category: "自動化感應類", items: [{ name: "人存在感測器", price: 1500 }, { name: "紅外線感測器", price: 850 }, { name: "門窗感測器", price: 850 }] },
  { category: "智能開關類", items: [{ name: "1鍵開關", price: 1600 }, { name: "3鍵開關", price: 1700 }, { name: "4鍵開關", price: 2100 }, { name: "6鍵開關", price: 3680 }] },
  { category: "中樞類", items: [{ name: "Zigbee網關", price: 5800 }, { name: "WiFi路由器", price: 1200 }] }
];

// --- Computeds ---
const currentRoom = computed(() => activeRoom.value ? rooms.value[activeRoom.value] : null);
const activeItemData = computed(() => placedItems.value.find(i => i.id === activeItem.value));
const summaryData = computed(() => {
  const counts: any = {};
  let total = 0;
  placedItems.value.forEach(item => {
    counts[item.name] = (counts[item.name] || 0) + 1;
    total += item.price;
  });
  return { list: Object.entries(counts).sort((a:any, b:any) => b[1] - a[1]), total };
});

// --- Methods ---
const getPointsStr = (points: any[]) => points.map(p => `${p.x},${p.y}`).join(' ');

const getPolygonCenter = (points: any[]) => {
  if (!points || points.length === 0) return { x: 0, y: 0 };
  const xSum = points.reduce((sum, p) => sum + p.x, 0);
  const ySum = points.reduce((sum, p) => sum + p.y, 0);
  return { x: xSum / points.length, y: ySum / points.length };
};

const isPointInPolygon = (x: number, y: number, points: any[]) => {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x, yi = points[i].y;
    const xj = points[j].x, yj = points[j].y;
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const toggleCategory = (cat: string) => {
  expandedCategories.value[cat] = !expandedCategories.value[cat];
};

const addNewRoom = () => {
  const id = `room_${Date.now()}`;
  rooms.value[id] = {
    id, name: "新區域", points: [{x:100,y:100}, {x:220,y:100}, {x:220,y:220}, {x:100,y:220}],
    bgColor: '#f1f5f9', textColor: '#475569', icon: "Layout", devices: []
  };
  saveHistory();
  activeRoom.value = id;
  activeItem.value = null;
  selectedAnchorIndices.value = [];
};

const deleteRoom = (id: string) => {
  delete rooms.value[id];
  saveHistory();
  activeRoom.value = null;
};

const addProductToMap = (product: any) => {
  placedItems.value.push({
    id: `item_${Date.now()}`,
    name: product.name,
    price: product.price,
    x: 250,
    y: 150
  });
  saveHistory();
};

const addAnchor = (roomId: string, index: number, e: MouseEvent) => {
  const room = rooms.value[roomId];
  const p1 = room.points[index];
  const p2 = room.points[(index + 1) % room.points.length];
  const newPoints = [...room.points];
  newPoints.splice(index + 1, 0, { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });
  rooms.value[roomId].points = newPoints;
  selectedAnchorIndices.value = [index + 1];
  resizing.value = { id: index + 1, roomId };
  dragStart.value = { x: e.clientX, y: e.clientY };
};

const handleAnchorMouseDown = (id: string, index: number, e: MouseEvent) => {
  activeRoom.value = id;
  activeItem.value = null;
  if (isCtrlPressed.value) {
    if (selectedAnchorIndices.value.includes(index)) {
      selectedAnchorIndices.value = selectedAnchorIndices.value.filter(i => i !== index);
    } else {
      selectedAnchorIndices.value.push(index);
    }
  } else if (!selectedAnchorIndices.value.includes(index)) {
    selectedAnchorIndices.value = [index];
  }
  resizing.value = { id: index, roomId: id };
  dragStart.value = { x: e.clientX, y: e.clientY };
};

const handleRoomMouseDown = (id: string, e: MouseEvent) => {
  dragging.value = { type: 'room', id };
  dragStart.value = { x: e.clientX, y: e.clientY };
  activeRoom.value = id;
  activeItem.value = null;
  if (!isCtrlPressed.value) selectedAnchorIndices.value = [];
};

const handleItemMouseDown = (id: string, e: MouseEvent) => {
  dragging.value = { type: 'item', id };
  dragStart.value = { x: e.clientX, y: e.clientY };
  activeItem.value = id;
  activeRoom.value = null;
};

const handleContainerClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).id === 'map-container') {
    activeRoom.value = null;
    activeItem.value = null;
    selectedAnchorIndices.value = [];
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (resizing.value) {
    const dx = e.clientX - dragStart.value.x;
    const dy = e.clientY - dragStart.value.y;
    const room = rooms.value[resizing.value.roomId];
    if (room) {
      room.points = room.points.map((p: any, idx: number) => 
        selectedAnchorIndices.value.includes(idx) ? { x: p.x + dx, y: p.y + dy } : p
      );
    }
    dragStart.value = { x: e.clientX, y: e.clientY };
  }
  if (dragging.value) {
    const dx = e.clientX - dragStart.value.x;
    const dy = e.clientY - dragStart.value.y;
    if (dragging.value.type === 'room') {
      const room = rooms.value[dragging.value.id];
      if (room) {
        room.points = room.points.map((p: any) => ({ x: p.x + dx, y: p.y + dy }));
      }
    } else {
      const item = placedItems.value.find(i => i.id === dragging.value.id);
      if (item) {
        item.x += dx;
        item.y += dy;
      }
    }
    dragStart.value = { x: e.clientX, y: e.clientY };
  }
};

const handleMouseUp = () => {
  if (dragging.value && dragging.value.type === 'item') {
    const item = placedItems.value.find(i => i.id === dragging.value.id);
    if (item) {
      let targetRoomId = null;
      Object.values(rooms.value).forEach((room: any) => {
        if (isPointInPolygon(item.x + 30, item.y + 12, room.points)) {
          targetRoomId = room.id;
        }
      });

      // Update room device lists
      Object.keys(rooms.value).forEach(roomId => {
        rooms.value[roomId].devices = rooms.value[roomId].devices.filter((d: any) => d.tagId !== dragging.value.id);
      });

      if (targetRoomId) {
        rooms.value[targetRoomId].devices.push({
          name: item.name,
          note: "自動識別位置新增",
          tagId: item.id
        });
      }
    }
  }
  
  if (dragging.value || resizing.value) {
    saveHistory();
  }
  dragging.value = null;
  resizing.value = null;
};

const addNewDevice = () => {
  if (!newDeviceName.value || !activeRoom.value) return;
  rooms.value[activeRoom.value].devices.push({
    name: newDeviceName.value,
    note: "手動"
  });
  saveHistory();
  newDeviceName.value = '';
};

const removeDevice = (idx: number) => {
  if (!activeRoom.value) return;
  rooms.value[activeRoom.value].devices.splice(idx, 1);
  saveHistory();
};

const clearRoomDevices = () => {
  if (!activeRoom.value) return;
  rooms.value[activeRoom.value].devices = [];
  saveHistory();
};

const removeItemTag = () => {
  if (!activeItem.value) return;
  // Remove from room device lists
  Object.keys(rooms.value).forEach(id => {
    rooms.value[id].devices = rooms.value[id].devices.filter((d: any) => d.tagId !== activeItem.value);
  });
  placedItems.value = placedItems.value.filter(i => i.id !== activeItem.value);
  saveHistory();
  activeItem.value = null;
};

// --- Lifecycle ---
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  saveHistory();
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style scoped lang="scss">
.design-planner {
  font-family: 'Inter', 'Noto Sans TC', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  .animate-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .scrollbar-hide {
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  input[type="color"] {
    &::-webkit-color-swatch-wrapper { padding: 0; }
    &::-webkit-color-swatch { border: none; border-radius: 8px; }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
