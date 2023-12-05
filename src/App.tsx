import { useState, useEffect } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import './App.css';

interface Make {
  id: number;
  name: string;
}

interface Car {
  id: number;
  make_id: number;
  name: string;
  make: Make;
}

const carYears = ['2020', '2019', '2018', '2017', '2016', '2015'];

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [year, setYear] = useState<string>('2020');
  const [carData, setCarData] = useState<Car[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [cache, setCache] = useState<Record<string, Car[]>>({});

  const handleSwitch = () : void => {
    setDarkMode(prev => !prev);
  };
  
  const handleYear = (e : React.MouseEvent<HTMLButtonElement>) : void => {
    const target = e.currentTarget as HTMLButtonElement;
    setYear(target.value);
    setPageNumber(1);
    setSelectedCar(null);
  };

  const handleNextNumber = () : void => {
    pageNumber < 5 ? setPageNumber(prev => prev + 1) : null;
    setSelectedCar(null);
  };

  const handlePrevNumber = () : void => {
    pageNumber > 1 ? setPageNumber(prev => prev - 1) : null;
    setSelectedCar(null);
  };

  const handleCarClick = (car: Car) : void => {
    setSelectedCar(car);
  };

  const fetchCarData = async () : Promise<void> => {
    const key = `${pageNumber}_${year}`;
    if (cache[key]) {
      console.log("CACHE")
      setCarData(cache[key]);
      return;
    }
    
    const url = `https://car-api2.p.rapidapi.com/api/models?limit=6&sort=name&page=${pageNumber}&direction=asc&year=${year}&verbose=yes`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '5776a411b1msh06e20a0d281041ap1882d7jsnd75b48832237',
        'X-RapidAPI-Host': 'car-api2.p.rapidapi.com'
      }
    };
  
    try {
      console.log("FETCH")
      const response = await fetch(url, options);
      const result = await response.json();
      setCarData(result.data);
      setCache({ ...cache, [key]: result.data });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCarData()
  }, [year, pageNumber]);

  useEffect(() => {
    console.log(carData)
  }, [carData]);

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <div className='main-container'>
        <header>
          <h1>Car Finder</h1>
        </header>
        <main>
          <div className='data-container'>
            <div className='buttons-container'>
            {
              carYears.map(carYear => 
                <button 
                  key={carYear}
                  value={carYear} 
                  onClick={handleYear}
                  className={year === carYear ? 'selected-year' : 'year-button'} 
                >
                  {carYear}
                </button>
              )
            }
            </div>
            <div className='car-container'>
              <div className='car-data'>
              {selectedCar ? (
                  <div className='expanded-car' onClick={() => setSelectedCar(null)}>
                      <img src={`./assets/Logos/${selectedCar.make.name}.png`}></img>
                      <h2>{selectedCar.make.name}</h2>
                      <p>{selectedCar.name}</p>
                  </div>
              ) : (
                  carData.length ? (
                      carData.map((car: Car, index: number) => (
                          <div key={index} className='car' onClick={() => handleCarClick(car)}>
                              <h2>{car.make.name}</h2>
                              <p>{car.name}</p>
                          </div>
                      ))
                  ) : (
                      <div></div>
                  )
              )}
              </div>
              <div className='pagination-container'>
                <button disabled={pageNumber === 1 ? true : false} onClick={handlePrevNumber} className={pageNumber === 1 ? 'disabled-button' : 'page-buttons'}>Previous</button>
                <button disabled={pageNumber === 5 ? true : false} onClick={handleNextNumber} className={pageNumber === 5 ? 'disabled-button' : 'page-buttons'}>Next</button>
              </div>
            </div>
          </div>
        </main>
        <footer>
          <div className='switch'>
            <Switch.Root onCheckedChange={handleSwitch} className="SwitchRoot">
              <Switch.Thumb className="SwitchThumb">
                {darkMode ? <MoonIcon/> : <SunIcon/>}
              </Switch.Thumb>
            </Switch.Root>
          </div>
        </footer>
      </div>
    </div>
  )
};

export default App;