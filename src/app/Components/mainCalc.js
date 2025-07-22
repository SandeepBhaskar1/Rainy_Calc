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
  const [costOfRWF, setCostOfRWF] = useState(0);
  const [roi, setRoi] = useState(null);
  const [savings, setSavings] = useState(null);
  const [profit, setProfit] = useState(null);
  const [showROI, setShowROI] = useState(false);

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
    let filter = '';
    let costOfRWF = 0

    if (roofArea >= 1 && roofArea <= 1291.67) {
        filter = 'Rainy FL-80'
        costOfRWF = 8500;
    } else if (roofArea >= 1291.68 && roofArea <= 1937.5){
        filter = 'Rainy FL-150'
        costOfRWF = 10850;
    } else if (roofArea >= 1937.6 && roofArea <= 2690.98) {
        filter = "Rainy FL-250"
        costOfRWF = 13750;
    } else if (roofArea >= 2690.99 && roofArea <= 4036.47) {
        filter = "Rainy FL-350"
        costOfRWF = 19500;
    } else if (roofArea >= 4036.48 && roofArea <= 5381.96) {
        filter = "Rainy FL-500"
        costOfRWF = 26500;
    } else if (roofArea > 5381.96) {
        filter = 'As your roof area is large you need custom solution, please contact us. Thank you'
    }
    setFilter(filter);
    setCostOfRWF(costOfRWF)
  };

  const waterCost = 0.1;

  useEffect(() => {
    if (rainwaterSaved && costOfRWF && costOfRWF > 0) {
      const calcSavings = parseFloat(rainwaterSaved) * waterCost;
      const CalcProfit = (calcSavings) - costOfRWF;
      const ROIValue = ((CalcProfit) /costOfRWF)*100;

      setSavings(calcSavings);
      setProfit(CalcProfit);
      setRoi(ROIValue.toFixed(2));
    } else {
      setRoi(null);
      setSavings(null);
      setProfit(null);
    }
    // console.log(profit);
    // console.log(savings);
  }, [rainwaterSaved, costOfRWF])
  console.log(roi);
  
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

          <button onClick={handleSubmit} type='submit'>Submit</button>
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

          { roi !== null && !showROI && (
            <button type='button' onClick = {() => setShowROI(true)}>Check ROI</button>
          )}


          {roi !== null && showROI && (
            <>
            <p>Total Savings From Water : <strong>{savings}</strong></p>
            <p>Profit (Savings - Filter Cost) : <strong>{profit}</strong></p>
            <p><strong>Estinated ROI : <strong>{roi}%</strong></strong></p>
            </>
          )} 
        </>
      )}

      </form>
    </div>
  );
}
