import { React , useState, useEffect, useContext} from 'react';
import { loader } from '../assets';
import axios from 'axios'
import { tagType, thirdweb } from '../assets';
import { SERVER_URL } from '../constants';
// import { UserContext } from '../App';

function UserDonation() {
  // const {state , dispatch} = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [donations , setDonations] = useState([]);

  const fetchCampaigns = () => {
    axios.post(SERVER_URL +'/getManyDonatedCampaigns', state.loggedUser.donated_campaigns) //returns list of campaigns from id's in yourCampaigns
      .then((res) => {
        setCampaigns(res.data.campaigns)
        setDonations(res.data.donations)
        setIsLoading(false)
      })
      .catch((err)=>console.log(err))
    }

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      fetchCampaigns();
    },700)
  }, []);

    return (
    <div>
        <h1 className="font-epilogue font-semibold text-xl md:text-3xl text-white text-center md:text-left">Your Donations ({campaigns.length})</h1>
        <div className="flex flex-wrap md:justify-start justify-center mt-[20px] gap-[26px]">
            {isLoading && (
            <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
            )}

            {!isLoading && campaigns.length === 0 && (
            <p className="font-epilogue font-semibold text-[14px] text-center md:text-left leading-[30px] text-[#818183]">
                You have not donated money to campaigns yet...
            </p>
            )}

            {!isLoading && campaigns.length > 0 && campaigns.map((campaign , index) => {
                return (
                    <div key={campaign.id} className='w-full md:w-[600px]'>
                      <div className="mx-auto rounded-[15px] bg-[#1c1c24] text-[#1dc071] flex flex-col md:flex-row">
                        <div className="w-[145px] h-[145px] hidden md:block overflow-hidden rounded-l-[15px]">
                            {campaign.image && (
                                <img src={campaign.image} alt="fund" className="w-full h-full object-cover" />
                            )}
                        </div>

                        <div className="flex flex-col flex-1 p-4 ">
                            <div className="flex flex-row items-center mb-[5px] ">
                                <img src={tagType} alt="tag" className="w-auto h-[15px] object-contain hidden md:block" />
                                <p className="ml-[7px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191] hidden md:block">{campaign.towards}</p>
                            </div>

                            <div className="block">
                                <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] line-clamp-1">{campaign.title}</h3>
                                {campaign.description && (
                                    <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] line-clamp-1">{campaign.description}</p>
                                )}
                            </div>

                            <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                                <div className="flex flex-col">
                                    <h4 className="font-epilogue font-semibold text-[18px] leading-[22px]">You Donated  ${donations[index]}</h4>
                                </div>

                            </div>
                        </div>
                    </div>


                    </div>
                )
            })}
      </div>
    </div>
  )
}

export default UserDonation
