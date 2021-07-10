var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleRepairer = require('role.repairer');

module.exports.loop = function () {

    var desiredHarvesters = 2;
    var desiredUpgraders = 4;
    var desiredBuilders = 3;
    var desiredRepairers = 2;
    console.log('github stuff');

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if (harvesters.length < desiredHarvesters) {
        var newName = 'Harvester' + Game.time;
        var canSpawnHarvester = Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName,
            { memory: { role: 'harvester', dryRun: true } });
        // console.log(canSpawnHarvester);
        if (canSpawnHarvester == 0) {
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'harvester', debug: false } });
        }
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (upgraders.length < desiredUpgraders && harvesters.length == desiredHarvesters) {
        var newName = 'Upgrader' + Game.time;
        var canSpawnUpgrader = Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName,
            { memory: { role: 'upgrader', dryRun: true } });
        // console.log(canSpawnUpgrader);
        if (canSpawnUpgrader == 0) {
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'upgrader', debug: false } });
        }
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if (builders.length < desiredBuilders && upgraders.length == desiredUpgraders) {
        var newName = 'Builder' + Game.time;
        var canSpawnBuilder = Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName,
            { memory: { role: 'builder', dryRun: true } });
        // console.log(canSpawnBuilder);
        if (canSpawnBuilder == 0) {
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'builder', debug: false } });
        }
    }

    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    if (repairers.length < desiredRepairers && builders.length == desiredBuilders) {
        var newName = 'Repairer' + Game.time;
        var canSpawnRepairer = Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName,
            { memory: { role: 'repairer', dryRun: true } });
        // console.log(canSpawnRepairer);
        if (canSpawnRepairer == 0) {
            console.log('Spawning new repairer: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'repairer', debug: false } });
        }
    }

    var tower = Game.getObjectById('TOWER_ID');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }

    if (Game.time % 100 == 0) {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
}