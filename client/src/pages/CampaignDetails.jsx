import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../constants';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';
import  axios  from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@nextui-org/react';
import { UserContext } from '../App';

const CampaignDetails = () => {
  const { state } = useLocation();
  const { _ , dispatch} = useContext(UserContext)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [checkCampaign , setCheckCampaign] = useState(false)
  const remainingDays = daysLeft(state.deadline);

  useEffect(() => {
    setTimeout(()=>{
      axios.get(`${SERVER_URL}/getCampaign/${state._id}`)
      .then((res)=>{
        setDonators(res.data.donators)
      })
      .catch((e)=>{console.log(e)})
      checkUser();
    },700)
  }, [])

  const handleDonate = () => {
    setIsLoading(true);
    axios.post(SERVER_URL + '/donate' , {campaign: state, donation: amount} , {withCredentials: true})
      .then((res)=>{
        console.log('Donated: '+ amount + ` to ${state.title}`)
        dispatch({type: "USER" , payload: {loggedIn: true, loggedUser: res.data.updatedUser}});
        toast.success(res.data.message)
      })
      .catch((e)=>{toast.error("Error : " + e)})
    setIsLoading(false);
    navigate('/')
  }

  const handleDelete = () =>{
    axios.post(SERVER_URL + '/deleteCampaign', {_id: state._id} , {withCredentials: true})
      .then((res) => {
        if(res.status === 200){
          toast.success("Campaign deleted Succesfully")
          navigate('/')
        } 
        else{
          toast.error("Campaign couldn't be deleted")
        }
    })
    .catch((e)=>console.log(e))
  }

  const handleUpdate = () => {
    navigate(`/update/${state._id}` , {state : state})
  }

  const checkUser = () => {
    axios.post(SERVER_URL + '/checkCampaign', {title: state.title} , {withCredentials: true})
          .then((res) => {
            if(res.data.maker.name === res.data.requester.name) 
              setCheckCampaign(true)
        })
        .catch((e)=>{
          console.log(e);
          setCheckCampaign(false)
      })
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <p className='mt-4 text-xl font-semibold'>Goal Progress: </p><br/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] -mt-4">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-around gap-[30px]">
          <CountBox title="Days Left" value={remainingDays > 0 ? remainingDays : "Ended"} />
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="Total Donators" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold font-['Ubuntu'] text-[28px] text-center lg:text-left text-white uppercase">{state.title}</h4>

            <div className="mt-[20px] flex flex-row items-center justify-center lg:justify-start flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.name}</h4>
              </div>    
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold font-['Ubuntu'] text-[22px] text-white text-center lg:text-left uppercase">DESCRIPTION</h4>
            <div className="mt-[6px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold font-['Ubuntu'] text-[22px] text-white text-center lg:text-left uppercase">Donators ({state.donators.length})</h4>

              <div className="mt-[10px] flex flex-col gap-4 mb-8">
                {state.donators.length > 0 ? state.donators.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className='w-full flex justify-between items-center bg-[#1c1c24] px-6 py-4 rounded-lg'>
                      <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator.name}</p>
                      <p className="font-epilogue font-semibold text-[18px] text-[#808191] leading-[26px] break-ll">$ {item.donator.donation}</p>
                    </div>
                  </div>
                )) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
                )}
              </div>
              <div className="flex justify-around lg:justify-start gap-4">
                {checkCampaign && 
                  <Button onPress={()=>{handleDelete()}} color="danger" variant="bordered" className='text-center mb-24 hover:border-[#f31260]'>
                    Delete Campaign
                  </Button>
                }

                {checkCampaign && 
                  <Button onPress={()=>{handleUpdate()}} color="primary" variant="bordered" className='text-center mb-24'>
                    Update Campaign
                  </Button>
                }
              </div>
          </div>
        </div>

        { remainingDays > 0 ? 
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold font-['Ubuntu'] text-[24px] text-white text-center lg:text-left uppercase">Funding</h4>   

          <div className="mt-[10px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund this campaign
            </p>
            <div className="mt-[20px]">
              <input 
                type="number"
                placeholder="$100"
                step="1"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                <p className="mt-[10px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
              </div>

              <CustomButton 
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
                handleClick={() => {
                  handleDonate();
                }}
              />
            </div>
          </div>
        </div> : null}
      </div>
    </div>
  )
}

export default CampaignDetails