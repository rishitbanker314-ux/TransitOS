#!/usr/bin/env node
// Firebase Seed Script — retries with 2s delay between collections
// Run: node seed.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDNa67HCCHyK8F0I6GQvahbTpBhzOlLfvo",
  authDomain: "transitops-502209.firebaseapp.com",
  projectId: "transitops-502209",
  storageBucket: "transitops-502209.firebasestorage.app",
  messagingSenderId: "746211090171",
  appId: "1:746211090171:web:7bc825754eb471e084da5e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const now = new Date().toISOString();
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

const vehicles = [
  { id:'veh-001', registrationNumber:'GJ-01-AB-4321', name:'Tata Ace Gold', type:'Mini', make:'Tata', model:'Ace Gold', year:2022, capacity:750, payloadCapacity:750, currentOdometer:42300, odometerReading:42300, acquisitionCost:650000, status:'Available', specifications:{fuelType:'Diesel',transmission:'Manual',year:2022}, insuranceExpiry:'2027-03-15', pucExpiry:'2025-09-30', isArchived:false, version:1, createdAt:daysAgo(180), createdBy:'admin', updatedAt:daysAgo(2) },
  { id:'veh-002', registrationNumber:'GJ-01-CD-7788', name:'Mahindra Bolero Pickup', type:'Mini', make:'Mahindra', model:'Bolero Pickup', year:2021, capacity:1000, payloadCapacity:1000, currentOdometer:68900, odometerReading:68900, acquisitionCost:875000, status:'On Trip', specifications:{fuelType:'Diesel',transmission:'Manual',year:2021}, insuranceExpiry:'2026-11-20', pucExpiry:'2025-07-31', isArchived:false, version:1, createdAt:daysAgo(300), createdBy:'admin', updatedAt:daysAgo(1) },
  { id:'veh-003', registrationNumber:'GJ-06-EF-2233', name:'Ashok Leyland Dost', type:'Mini', make:'Ashok Leyland', model:'Dost Strong', year:2023, capacity:1500, payloadCapacity:1500, currentOdometer:18400, odometerReading:18400, acquisitionCost:1050000, status:'Available', specifications:{fuelType:'Diesel',transmission:'Manual',year:2023}, insuranceExpiry:'2028-01-10', pucExpiry:'2026-01-10', isArchived:false, version:1, createdAt:daysAgo(90), createdBy:'admin', updatedAt:daysAgo(5) },
  { id:'veh-004', registrationNumber:'GJ-02-GH-5599', name:'Tata LPT 1512', type:'Truck', make:'Tata Motors', model:'LPT 1512', year:2020, capacity:8000, payloadCapacity:8000, currentOdometer:134500, odometerReading:134500, acquisitionCost:2200000, status:'In Shop', specifications:{fuelType:'Diesel',transmission:'Manual',year:2020}, insuranceExpiry:'2026-08-05', pucExpiry:'2025-08-05', isArchived:false, version:1, createdAt:daysAgo(400), createdBy:'admin', updatedAt:daysAgo(3) },
  { id:'veh-005', registrationNumber:'GJ-03-IJ-9900', name:'BharatBenz 1217C', type:'Truck', make:'BharatBenz', model:'1217C', year:2022, capacity:10000, payloadCapacity:10000, currentOdometer:77200, odometerReading:77200, acquisitionCost:2850000, status:'Available', specifications:{fuelType:'Diesel',transmission:'Automated Manual',year:2022}, insuranceExpiry:'2027-05-22', pucExpiry:'2025-11-22', isArchived:false, version:1, createdAt:daysAgo(200), createdBy:'admin', updatedAt:daysAgo(7) },
  { id:'veh-006', registrationNumber:'GJ-05-KL-3344', name:'Eicher Pro 3015', type:'Truck', make:'Eicher', model:'Pro 3015', year:2021, capacity:6000, payloadCapacity:6000, currentOdometer:98100, odometerReading:98100, acquisitionCost:1750000, status:'On Trip', specifications:{fuelType:'Diesel',transmission:'Manual',year:2021}, insuranceExpiry:'2026-09-14', pucExpiry:'2025-09-14', isArchived:false, version:1, createdAt:daysAgo(280), createdBy:'admin', updatedAt:daysAgo(0) },
  { id:'veh-007', registrationNumber:'GJ-01-MN-6677', name:'Force Traveller 3700', type:'Van', make:'Force Motors', model:'Traveller 3700', year:2023, capacity:2500, payloadCapacity:2500, currentOdometer:22700, odometerReading:22700, acquisitionCost:1350000, status:'Available', specifications:{fuelType:'Diesel',transmission:'Manual',year:2023}, insuranceExpiry:'2028-02-28', pucExpiry:'2026-02-28', isArchived:false, version:1, createdAt:daysAgo(110), createdBy:'admin', updatedAt:daysAgo(4) },
  { id:'veh-008', registrationNumber:'GJ-04-OP-1122', name:'Tata Winger Delivery', type:'Van', make:'Tata', model:'Winger', year:2020, capacity:1800, payloadCapacity:1800, currentOdometer:105600, odometerReading:105600, acquisitionCost:1120000, status:'Available', specifications:{fuelType:'Diesel',transmission:'Manual',year:2020}, insuranceExpiry:'2026-06-30', pucExpiry:'2025-06-30', isArchived:false, version:1, createdAt:daysAgo(500), createdBy:'admin', updatedAt:daysAgo(6) },
];

const drivers = [
  { id:'drv-001', firstName:'Ramesh', lastName:'Patel', email:'ramesh.patel@transitops.in', phone:'+91 98250 34811', licenseNumber:'GJ01-2019-0034811', licenseCategory:'HMV', licenseExpiry:'2029-04-15', dateOfBirth:'1985-04-22', joinedAt:daysAgo(730), status:'Available', isArchived:false, version:1, createdAt:daysAgo(730), createdBy:'admin' },
  { id:'drv-002', firstName:'Suresh', lastName:'Mistry', email:'suresh.mistry@transitops.in', phone:'+91 94270 88122', licenseNumber:'GJ01-2020-0088122', licenseCategory:'HMV', licenseExpiry:'2030-08-20', dateOfBirth:'1990-08-10', joinedAt:daysAgo(500), status:'Assigned', isArchived:false, version:1, createdAt:daysAgo(500), createdBy:'admin' },
  { id:'drv-003', firstName:'Priya', lastName:'Sharma', email:'priya.sharma@transitops.in', phone:'+91 99099 45321', licenseNumber:'GJ06-2021-0045321', licenseCategory:'LMV', licenseExpiry:'2031-03-10', dateOfBirth:'1993-03-15', joinedAt:daysAgo(400), status:'Available', isArchived:false, version:1, createdAt:daysAgo(400), createdBy:'admin' },
  { id:'drv-004', firstName:'Dinesh', lastName:'Chauhan', email:'dinesh.chauhan@transitops.in', phone:'+91 97240 67900', licenseNumber:'GJ02-2018-0067900', licenseCategory:'HMV', licenseExpiry:'2025-01-05', dateOfBirth:'1982-01-18', joinedAt:daysAgo(900), status:'Suspended', isArchived:false, version:1, createdAt:daysAgo(900), createdBy:'admin' },
  { id:'drv-005', firstName:'Kavita', lastName:'Joshi', email:'kavita.joshi@transitops.in', phone:'+91 91585 23100', licenseNumber:'GJ05-2022-0023100', licenseCategory:'LMV', licenseExpiry:'2032-07-18', dateOfBirth:'1995-07-25', joinedAt:daysAgo(200), status:'Available', isArchived:false, version:1, createdAt:daysAgo(200), createdBy:'admin' },
  { id:'drv-006', firstName:'Nilesh', lastName:'Desai', email:'nilesh.desai@transitops.in', phone:'+91 98790 55610', licenseNumber:'GJ03-2020-0055610', licenseCategory:'HMV', licenseExpiry:'2030-11-30', dateOfBirth:'1988-11-04', joinedAt:daysAgo(350), status:'Assigned', isArchived:false, version:1, createdAt:daysAgo(350), createdBy:'admin' },
  { id:'drv-007', firstName:'Hitesh', lastName:'Vaghela', email:'hitesh.vaghela@transitops.in', phone:'+91 96010 11223', licenseNumber:'GJ04-2021-0011223', licenseCategory:'HMV', licenseExpiry:'2031-06-12', dateOfBirth:'1987-06-20', joinedAt:daysAgo(260), status:'On Leave', isArchived:false, version:1, createdAt:daysAgo(260), createdBy:'admin' },
];

const trips = [
  { id:'trip-001', title:'Gandhinagar Depot → Ahmedabad Central Hub', status:'Completed', vehicleId:'veh-001', driverId:'drv-001', route:{origin:{lat:23.2156,lng:72.6369,address:'Gandhinagar Depot'},destination:{lat:23.0225,lng:72.5714,address:'Ahmedabad Central Hub'},stops:[],estimatedDistanceKm:28}, schedule:{plannedStartTime:daysAgo(12),plannedEndTime:daysAgo(12),actualStartTime:daysAgo(12),actualEndTime:daysAgo(12)}, createdAt:daysAgo(13), updatedAt:daysAgo(12), createdBy:'admin' },
  { id:'trip-002', title:'Vatva Industrial Area → Sanand Warehouse', status:'Completed', vehicleId:'veh-003', driverId:'drv-003', route:{origin:{lat:22.9964,lng:72.6271,address:'Vatva Industrial Area'},destination:{lat:22.9961,lng:72.3815,address:'Sanand Warehouse'},stops:[],estimatedDistanceKm:42}, schedule:{plannedStartTime:daysAgo(10),plannedEndTime:daysAgo(10),actualStartTime:daysAgo(10),actualEndTime:daysAgo(10)}, createdAt:daysAgo(11), updatedAt:daysAgo(10), createdBy:'admin' },
  { id:'trip-003', title:'Surat Textile Hub → Rajkot Distribution Centre', status:'Completed', vehicleId:'veh-005', driverId:'drv-001', route:{origin:{lat:21.1702,lng:72.8311,address:'Surat Textile Hub'},destination:{lat:22.3039,lng:70.8022,address:'Rajkot Distribution Centre'},stops:[],estimatedDistanceKm:235}, schedule:{plannedStartTime:daysAgo(8),plannedEndTime:daysAgo(7),actualStartTime:daysAgo(8),actualEndTime:daysAgo(7)}, createdAt:daysAgo(9), updatedAt:daysAgo(7), createdBy:'admin' },
  { id:'trip-004', title:'Ahmedabad Hub → Baroda Logistics Park', status:'Completed', vehicleId:'veh-007', driverId:'drv-005', route:{origin:{lat:23.0225,lng:72.5714,address:'Ahmedabad Hub'},destination:{lat:22.3072,lng:73.1812,address:'Baroda Logistics Park'},stops:[],estimatedDistanceKm:108}, schedule:{plannedStartTime:daysAgo(6),plannedEndTime:daysAgo(6),actualStartTime:daysAgo(6),actualEndTime:daysAgo(6)}, createdAt:daysAgo(7), updatedAt:daysAgo(6), createdBy:'admin' },
  { id:'trip-005', title:'Kalol Factory → Mehsana Storage', status:'Completed', vehicleId:'veh-008', driverId:'drv-003', route:{origin:{lat:23.2330,lng:72.5030,address:'Kalol Factory'},destination:{lat:23.5927,lng:72.3693,address:'Mehsana Storage'},stops:[],estimatedDistanceKm:47}, schedule:{plannedStartTime:daysAgo(5),plannedEndTime:daysAgo(5),actualStartTime:daysAgo(5),actualEndTime:daysAgo(5)}, createdAt:daysAgo(6), updatedAt:daysAgo(5), createdBy:'admin' },
  { id:'trip-006', title:'Anand Cold Store → Nadiad Depot', status:'Completed', vehicleId:'veh-001', driverId:'drv-001', route:{origin:{lat:22.5558,lng:72.9541,address:'Anand Cold Store'},destination:{lat:22.6916,lng:72.8634,address:'Nadiad Depot'},stops:[],estimatedDistanceKm:33}, schedule:{plannedStartTime:daysAgo(4),plannedEndTime:daysAgo(4),actualStartTime:daysAgo(4),actualEndTime:daysAgo(4)}, createdAt:daysAgo(5), updatedAt:daysAgo(4), createdBy:'admin' },
  { id:'trip-007', title:'Gandhinagar Depot → Ahmedabad Central Hub', status:'Completed', vehicleId:'veh-003', driverId:'drv-005', route:{origin:{lat:23.2156,lng:72.6369,address:'Gandhinagar Depot'},destination:{lat:23.0225,lng:72.5714,address:'Ahmedabad Central Hub'},stops:[],estimatedDistanceKm:28}, schedule:{plannedStartTime:daysAgo(3),plannedEndTime:daysAgo(3),actualStartTime:daysAgo(3),actualEndTime:daysAgo(3)}, createdAt:daysAgo(4), updatedAt:daysAgo(3), createdBy:'admin' },
  { id:'trip-008', title:'Bavla Industrial → Viramgam Transit Centre', status:'Completed', vehicleId:'veh-007', driverId:'drv-001', route:{origin:{lat:22.9186,lng:72.3829,address:'Bavla Industrial'},destination:{lat:23.1096,lng:72.0367,address:'Viramgam Transit Centre'},stops:[],estimatedDistanceKm:64}, schedule:{plannedStartTime:daysAgo(2),plannedEndTime:daysAgo(2),actualStartTime:daysAgo(2),actualEndTime:daysAgo(2)}, createdAt:daysAgo(3), updatedAt:daysAgo(2), createdBy:'admin' },
  { id:'trip-009', title:'Rajkot City Depot → Jamnagar Port Yard', status:'Assigned', vehicleId:'veh-002', driverId:'drv-002', route:{origin:{lat:22.3039,lng:70.8022,address:'Rajkot City Depot'},destination:{lat:22.4707,lng:70.0577,address:'Jamnagar Port Yard'},stops:[],estimatedDistanceKm:91}, schedule:{plannedStartTime:daysAgo(0),plannedEndTime:new Date(Date.now()+5*3600000).toISOString()}, createdAt:daysAgo(1), updatedAt:daysAgo(0), createdBy:'admin' },
  { id:'trip-010', title:'Vatva Industrial Area → Sanand Warehouse', status:'InProgress', vehicleId:'veh-006', driverId:'drv-006', route:{origin:{lat:22.9964,lng:72.6271,address:'Vatva Industrial Area'},destination:{lat:22.9961,lng:72.3815,address:'Sanand Warehouse'},stops:[],estimatedDistanceKm:42}, schedule:{plannedStartTime:daysAgo(0),plannedEndTime:new Date(Date.now()+2*3600000).toISOString(),actualStartTime:daysAgo(0)}, createdAt:daysAgo(0), updatedAt:daysAgo(0), createdBy:'admin' },
  { id:'trip-011', title:'Ahmedabad Hub → Baroda Logistics Park', status:'Draft', route:{origin:{lat:23.0225,lng:72.5714,address:'Ahmedabad Hub'},destination:{lat:22.3072,lng:73.1812,address:'Baroda Logistics Park'},stops:[],estimatedDistanceKm:108}, schedule:{plannedStartTime:new Date(Date.now()+24*3600000).toISOString(),plannedEndTime:new Date(Date.now()+30*3600000).toISOString()}, createdAt:daysAgo(0), updatedAt:daysAgo(0), createdBy:'admin' },
];

const maintenanceJobs = [
  { id:'mnt-001', title:'Engine Oil & Filter Change', vehicleId:'veh-001', type:'Preventive', description:'Scheduled engine oil change at 42000 km. Used Castrol GTX 15W-40.', status:'Completed', priority:'Medium', scheduledDate:daysAgo(45), estimatedDurationHours:2, actualDurationHours:1.5, partsUsed:[{id:'p1',name:'Engine Oil 5L',quantity:2,unitCost:750},{id:'p2',name:'Oil Filter',quantity:1,unitCost:320}], totalCost:1820, completedAt:daysAgo(45), createdAt:daysAgo(47), createdBy:'admin' },
  { id:'mnt-002', title:'Full Engine Overhaul', vehicleId:'veh-004', type:'Corrective', description:'Major engine wear at 130000 km. Pistons, rings and gaskets replaced.', status:'InProgress', priority:'Critical', scheduledDate:daysAgo(3), estimatedDurationHours:48, partsUsed:[{id:'p3',name:'Piston Kit (x6)',quantity:1,unitCost:24000},{id:'p4',name:'Head Gasket Set',quantity:1,unitCost:8500},{id:'p5',name:'Engine Bearings',quantity:1,unitCost:6800}], totalCost:52000, createdAt:daysAgo(4), createdBy:'admin' },
  { id:'mnt-003', title:'Tyre Replacement (4 Wheels)', vehicleId:'veh-006', type:'Corrective', description:'All 4 tyres worn below tread depth. Replaced with Apollo Endura-T.', status:'Completed', priority:'High', scheduledDate:daysAgo(20), estimatedDurationHours:3, actualDurationHours:2.5, partsUsed:[{id:'p6',name:'Apollo Tyre 7.50-16',quantity:4,unitCost:9200}], totalCost:36800, completedAt:daysAgo(20), createdAt:daysAgo(22), createdBy:'admin' },
  { id:'mnt-004', title:'AC Compressor Replacement', vehicleId:'veh-007', type:'Corrective', description:'AC compressor seized. Replaced and recharged refrigerant gas.', status:'Completed', priority:'Medium', scheduledDate:daysAgo(35), estimatedDurationHours:6, actualDurationHours:7, partsUsed:[{id:'p7',name:'AC Compressor',quantity:1,unitCost:14500},{id:'p8',name:'Refrigerant R134a',quantity:1,unitCost:1800}], totalCost:19800, completedAt:daysAgo(35), createdAt:daysAgo(37), createdBy:'admin' },
  { id:'mnt-005', title:'60,000 km Full Service', vehicleId:'veh-002', type:'Preventive', description:'60k service: air filter, fuel filter, brake pads, transmission fluid, wheel alignment.', status:'Completed', priority:'High', scheduledDate:daysAgo(15), estimatedDurationHours:5, actualDurationHours:5.5, partsUsed:[{id:'p9',name:'Air Filter',quantity:1,unitCost:850},{id:'p10',name:'Fuel Filter',quantity:1,unitCost:460},{id:'p11',name:'Brake Pad Set (Front)',quantity:1,unitCost:2200},{id:'p12',name:'Transmission Fluid 4L',quantity:1,unitCost:1400}], totalCost:8900, completedAt:daysAgo(15), createdAt:daysAgo(17), createdBy:'admin' },
  { id:'mnt-006', title:'Annual Fitness & PUC Inspection', vehicleId:'veh-005', type:'Preventive', description:'Annual certificate renewal. All systems — brakes, lighting, emissions checked.', status:'Completed', priority:'High', scheduledDate:daysAgo(60), estimatedDurationHours:4, actualDurationHours:3.5, partsUsed:[], totalCost:4500, completedAt:daysAgo(60), createdAt:daysAgo(62), createdBy:'admin' },
];

const fuelLogs = [
  { vehicleId:'veh-001', vehicleName:'GJ-01-AB-4321 (Tata Ace Gold)', date:daysAgo(2), liters:38, costPerLiter:88.5, totalCost:3363, createdAt:daysAgo(2) },
  { vehicleId:'veh-002', vehicleName:'GJ-01-CD-7788 (Bolero Pickup)', date:daysAgo(3), liters:65, costPerLiter:88.5, totalCost:5752.5, createdAt:daysAgo(3) },
  { vehicleId:'veh-003', vehicleName:'GJ-06-EF-2233 (Dost Strong)', date:daysAgo(4), liters:45, costPerLiter:88.5, totalCost:3982.5, createdAt:daysAgo(4) },
  { vehicleId:'veh-005', vehicleName:'GJ-03-IJ-9900 (BharatBenz 1217C)', date:daysAgo(5), liters:120, costPerLiter:88.5, totalCost:10620, createdAt:daysAgo(5) },
  { vehicleId:'veh-006', vehicleName:'GJ-05-KL-3344 (Eicher Pro 3015)', date:daysAgo(6), liters:95, costPerLiter:88.5, totalCost:8407.5, createdAt:daysAgo(6) },
  { vehicleId:'veh-007', vehicleName:'GJ-01-MN-6677 (Force Traveller)', date:daysAgo(7), liters:50, costPerLiter:88.5, totalCost:4425, createdAt:daysAgo(7) },
  { vehicleId:'veh-008', vehicleName:'GJ-04-OP-1122 (Tata Winger)', date:daysAgo(8), liters:42, costPerLiter:88.5, totalCost:3717, createdAt:daysAgo(8) },
  { vehicleId:'veh-001', vehicleName:'GJ-01-AB-4321 (Tata Ace Gold)', date:daysAgo(10), liters:40, costPerLiter:88.0, totalCost:3520, createdAt:daysAgo(10) },
  { vehicleId:'veh-005', vehicleName:'GJ-03-IJ-9900 (BharatBenz 1217C)', date:daysAgo(12), liters:115, costPerLiter:88.0, totalCost:10120, createdAt:daysAgo(12) },
  { vehicleId:'veh-006', vehicleName:'GJ-05-KL-3344 (Eicher Pro 3015)', date:daysAgo(15), liters:100, costPerLiter:87.5, totalCost:8750, createdAt:daysAgo(15) },
  { vehicleId:'veh-002', vehicleName:'GJ-01-CD-7788 (Bolero Pickup)', date:daysAgo(18), liters:70, costPerLiter:87.5, totalCost:6125, createdAt:daysAgo(18) },
  { vehicleId:'veh-003', vehicleName:'GJ-06-EF-2233 (Dost Strong)', date:daysAgo(20), liters:48, costPerLiter:87.5, totalCost:4200, createdAt:daysAgo(20) },
];

async function seed() {
  console.log('\n🚛  TransitOps Firebase Seeder\n');

  console.log('⏳ Waiting 3s for rules to propagate...');
  await sleep(3000);

  console.log('📦 Seeding vehicles...');
  for (const v of vehicles) {
    await setDoc(doc(db, 'vehicles', v.id), v);
    console.log(`   ✓ ${v.registrationNumber} — ${v.name} [${v.status}]`);
    await sleep(100);
  }

  await sleep(1000);
  console.log('\n👤 Seeding drivers...');
  for (const d of drivers) {
    await setDoc(doc(db, 'drivers', d.id), d);
    console.log(`   ✓ ${d.firstName} ${d.lastName} — ${d.licenseNumber} [${d.status}]`);
    await sleep(100);
  }

  await sleep(1000);
  console.log('\n🗺️  Seeding trips...');
  for (const t of trips) {
    const data = { ...t };
    if (!data.vehicleId) delete data.vehicleId;
    if (!data.driverId) delete data.driverId;
    await setDoc(doc(db, 'trips', t.id), data);
    console.log(`   ✓ ${t.id}: ${t.title} [${t.status}]`);
    await sleep(100);
  }

  await sleep(1000);
  console.log('\n🔧 Seeding maintenance jobs...');
  for (const j of maintenanceJobs) {
    await setDoc(doc(db, 'maintenance_jobs', j.id), j);
    console.log(`   ✓ ${j.title} — ${j.vehicleId} [${j.status}]`);
    await sleep(100);
  }

  await sleep(1000);
  console.log('\n⛽ Seeding fuel logs...');
  for (const f of fuelLogs) {
    await addDoc(collection(db, 'fuel_logs'), f);
    console.log(`   ✓ ${f.vehicleName} — ${f.liters}L — ₹${f.totalCost}`);
    await sleep(100);
  }

  console.log('\n✅ All done! Firebase seeded successfully.\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
