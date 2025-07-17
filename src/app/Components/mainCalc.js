"use client"
import React, { useEffect, useState } from 'react';

export default function MainCalc() {
  const [statesData, setStatesData] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [Districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [rainfall, setRainfall] = useState(null);
  const [rainwaterSaved, setRainwaterSaved] = useState('');
  const [roofArea, setRoofArea] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((data) => setStatesData(data));
  }, []);

  const handleStateChange = (e) => {
    const selected = e.target.value;
    setSelectedState(selected);
    setSelectedDistrict('');
    setRainfall(null);
    setRoofArea('');
    setRainwaterSaved(null);
    setShowResult(false);
    setFilter(null);

    const state = statesData.find((item) => item.State === selected);
    setDistricts(state ? state.Districts : []);
  };

  const handleDistrictChange = (e) => {
    const selected = e.target.value;
    setSelectedDistrict(selected);
    setShowResult(false);

    const district = Districts.find((d) => d.District === selected);
    setRainfall(district ? district['Rainfall in mm'] : null);
  };

  const handleRoofAreaChange = (e) => {
    const area = e.target.value;
    setRoofArea(area);
    setShowResult(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResult(false);

    if (rainfall && roofArea) {
      const areaInSqm = parseFloat(roofArea) * 0.092903;
      const saved = areaInSqm * parseFloat(rainfall) * 0.9;
      setRainwaterSaved(saved.toFixed(2));
      suitableFilter();
      setShowResult(true);
    } else {
      setRainwaterSaved('');
      setShowResult(false);
      suitableFilter(true);
    }
  };

  const suitableFilter = () => {
    if (roofArea >= 1 && roofArea <= 1200) {
        setFilter('Rainy FL-80')
    } else if (roofArea >= 1200 && roofArea <= 2000){
        setFilter('Rainy FL-120')
    } else {
        setFilter('Rainy FL-500')
    }
  } 

  return (
    <div className="container">
        <form>
      <label>Select State</label> <br />
      <select value={selectedState} onChange={handleStateChange}>
        <option value="">-- Select a State --</option>
        {statesData.map((state) => (
          <option key={state.State} value={state.State}>
            {state.State}
          </option>
        ))}
      </select> <br />

      {Districts.length > 0 && (
        <>
          <label>Select District</label> <br/>
          <select
            id="districtSelect"
            value={selectedDistrict}
            onChange={handleDistrictChange}
          > 
            <option value="">--Select District--</option>
            {Districts.map((district) => (
              <option key={district.District} value={district.District}>
                {district.District}
              </option> 
            ))}
          </select><br />
        </>
      )}

      {rainfall !== null && (
        <>
          <label>Roof Area in square feet</label><br />
          <input
            type="number"
            value={roofArea}
            onChange={handleRoofAreaChange}
            placeholder="Enter Roof Area"
          />

          <button onClick={handleSubmit}>Submit</button>
        </>
      )}

      {showResult && (
        <>
          <h3>Rainfall Data</h3>
          <p>
            <strong>{selectedDistrict}</strong> receives{' '}
            <strong>{rainfall} mm</strong> of Annual Rainfall.
          </p>

          <h2>Rainwater Saved Annually</h2>
          <p>
            <strong>{rainwaterSaved} Litres</strong> can be saved for a roof area
            of <strong>{roofArea} sq ft</strong>.
          </p>

          <h3>{filter}</h3>
        </>
      )}

      </form>
    </div>
  );
}
