// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Multiplier2 {
    struct Entry {
        uint256 id;
        uint256 value;
        uint256 result;
        uint256 total; // Nueva columna para almacenar el costo total
    }

    mapping(uint256 => Entry) public entries; // Mapeo para almacenar múltiples entradas
    uint256 public entryCount; // Contador de entradas

    // Agrega un nuevo valor y calcula el resultado
    function addEntry(uint256 _id, uint256 _value, uint256 numMinutes) public {
        uint256 calculatedResult = _value * 100;
        uint256 totalCost = calculateCost(numMinutes); // Calcula el costo total
        entries[_id] = Entry(_id, _value, calculatedResult, totalCost); // Incluye el costo total
        entryCount++;
    }

    // Obtiene el resultado de una entrada específica
    function getEntry(uint256 _id) public view returns (uint256, uint256, uint256, uint256) {
        Entry memory entry = entries[_id];
        return (entry.id, entry.value, entry.result, entry.total); // Devuelve el costo total
    }

    // Nueva función para convertir minutos a horas
    function convertMinutesToHours(uint256 numMinutes) public pure returns (uint256) {
        require(numMinutes > 0, "Los minutos deben ser mayores a 0");
        return numMinutes / 60; // Convierte minutos a horas
    }

    // Nueva función para calcular el costo basado en minutos
    function calculateCost(uint256 numMinutes) public pure returns (uint256) {
        require(numMinutes > 0, "Los minutos deben ser mayores a 0");
        uint256 totalHours = convertMinutesToHours(numMinutes); // Convierte minutos a horas
        uint256 costPerHour = 5; // Costo fijo por hora en dólares
        return totalHours * costPerHour; // Calcula el costo total
    }
}