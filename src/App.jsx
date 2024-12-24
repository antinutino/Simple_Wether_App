import { useEffect, useState } from "react"
function App() {
  const [location,setLocation]=useState()
  const [lat,setlat]=useState(23.7104);
  const [lon,setlon]=useState(90.4074);
  const [weather,setWeather]=useState([]);
  const [date,setdate]=useState('');
  const [id,setid]=useState(0);
  const Location_API_KEY='1a26d94544c2a5640a23c9f6abd7c3df'
  const Weather_API_KEY='4cd420e431mshd0ba039a7a8e935p14ed87jsn202d91863cea'
  const Weather_API_HOST='weatherbit-v1-mashape.p.rapidapi.com'


  const handleChange=(e)=>{
   const place=e.target.value;
   setLocation(place);
  }

  useEffect(() => {
    const today = new Date();
    setdate(today.toLocaleDateString('en-US', { weekday: 'long' })+" "+ today.toLocaleDateString());
  }, []);
  

  const handleSearch=async()=>{
   
    const response=await fetch(`http://api.positionstack.com/v1/forward?access_key=${Location_API_KEY}&query=${location}`)
    const data=await response.json();
    if(data.data.length>0)
    setlat(data.data[0].latitude)
    if(data.data.length>0)
    setlon(data.data[0].longitude)
  }

 useEffect(()=>{

  const fetchWeatherData=async()=>{
        const url = `https://weatherbit-v1-mashape.p.rapidapi.com/forecast/hourly?lat=${lat}&lon=${lon}&units=metric&lang=en`;
        const options = {
    	method: 'GET',
    	headers: {
    		'x-rapidapi-key': `${Weather_API_KEY}`,
    		'x-rapidapi-host': `${Weather_API_HOST}`
    	}
    };
    
        try {
          
          const response = await fetch(url, options);
    	const result = await response.json();
    	console.log("weather",result);
      setWeather(result);

        } catch (error) {
          console.log(error);
        }
      }
      fetchWeatherData();

 },[lat,lon])

 const handleHourSearch=(index)=>{
        setid(index);
 }



  return ( 
    <div className="bg-cyan-600 w-full h-full">
     <div>
      <p className="text-center text-xl bg-cyan-700 rounded-lg md:text-2xl font-semibold text-black  py-8">Weather App</p>
     </div>
     <div className="flex flex-col justify-center mx-4 items-center ">
      <label htmlFor="SearchLocation" className="text-lg py-2 font-semibold">Search Location</label>
     <div className="flex mx-auto w-full md:w-2/3 lg:w-1/3">
     <input type="text"
       id='location'
       name='location'
       value={location}
       onChange={handleChange}
       placeholder="Enter Location Here"
       className="p-2 text-gray-800 text-lg font-semibold rounded-lg w-full "
      />
      <button
      onClick={handleSearch}
      className="text-lg p-2 bg-green-700 rounded-lg ml-2 font-semibold">
        search
      </button>
     </div>
     </div>
     <div className="flex items-center justify-center space-x-4">
  {weather && weather.city_name && weather.data && weather.data[0] ? (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center items-center space-x-4">
      <div className="flex flex-col items-center my-12 ">
        <p className="text-2xl md:text-3xl font-semibold">
          {weather.city_name}, {weather.country_code}
        </p>
        <p>{date}</p>
        <p className="font-semibold">
          Timezone: <span className="text-xl font-semibold">{weather.timezone}</span>
        </p>
      </div>
      <div>
        <p className="text-6xl">{weather.data[id].app_temp}°C</p>
        <p className="text-end font-semibold text-lg">{weather.data[id].weather.description}</p>
      </div>
      </div>
      <div className="flex space-x-4 p-4 bg-sky-700 rounded-lg">
      <div className="text-center space-y-4">
        <p className="text-2xl font-semibold ">Humidity<br></br> <span className="text-lg ">{weather.data[id].rh}%</span></p>
        <p className="text-2xl font-semibold ">Pressure<br></br><span className="text-lg">{weather.data[id].slp} hPa</span></p>
      </div>
      <div className="text-center space-y-4">
        <p className="text-2xl font-semibold ">Wind Speed<br></br><span className="text-lg">{weather.data[id].wind_gust_spd}m/s </span></p>
        <p className="text-2xl font-semibold ">wind Direction<br></br><span className="text-lg">{weather.data[id].wind_cdir_full}</span></p>
      </div>
      </div>
      <div className="flex w-full  md:w-2/3 flex-col items-center justify-center mt-20 pb-10">
    <div className="mb-4">
      <span className="text-2xl font-semibold border-black border-b-2">Time</span>
    </div>
    <div className="flex w-full overflow-x-auto justify-center ">
    {
      weather.data.map((hourly,index)=>(
        <button
         className={`p-2 m-2 w-20 bg-sky-700 rounded-lg text-lg font-semibold  ${index<24?"block":"hidden"}`}
         onClick={()=>handleHourSearch(index)}
         >{hourly.datetime.split(':')[1]}:00</button>
      ))
    }
    </div>
 </div>

    </div>
    
  ) : (
    <p className="text-xl">Loading weather data...</p>
  )}
</div>
    </div>
  )
}

export default App
