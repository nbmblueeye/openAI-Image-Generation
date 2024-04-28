import React from 'react';
import { useState } from 'react';
import { Loader , LoaderButton } from '../components/Loader';
import Assets from '../assets';
import PaypalModal from '../components/PaypalModal';
import { useNavigate } from 'react-router-dom';

const Post = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showPapal, setShowPapal] = useState(false);
  
  const [form, setForm] = useState({
    paymentId:"",
    description: "",
    image: Assets.preview,
  });

  const [formErr, setFormErr ] = useState({
    status: "",
    description:false,
    message:""
  });

  const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({...form,[name]:value});
  }

  const generateImage = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await fetch("https://openai-image-generation-production.up.railway.app/api/v1/openai/", {
        method:"POST",
        headers:{
          'Content-type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      let data = await response.json();

      if(response.status === 200){
        setLoading(false);
        setFormErr(prevState => ({...prevState, ...{
          status: data.status,
          description: false,
          message: data.message
        }}));
        
        setForm({...form, image: `data:image/png;base64, ${data.image}`});

      }else if(response.status === 400){
        setLoading(false);
        setFormErr(prevState => ({...prevState, ...data}));
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  const saveImage = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setSaving(true);
    if(form.image.indexOf(";base64,") !== -1){
      try {
        const response = await fetch("https://openai-image-generation-production.up.railway.app/api/v1/post/", {
          method:"POST",
          headers:{
            'Content-type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        let data = await response.json();
    
        if(response.status == 200){
          setSaving(false);
          setFormErr(prevState => ({...prevState, ...{
            status: data.status,
            description:false,
            message:data.message
          }}));
  
          setTimeout(() => {
            setForm((prevState) => ({...prevState, ...{
              paymentId:"",
              description: "",
              image: Assets.preview,
            }}));
            navigate("/");
          }, 3000);

        }else if(response.status == 400){
          setSaving(false);
          setFormErr(prevState => ({...prevState, ...data}));
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      return false
    }
  }
  
  return (
    <div className='container max-w-7xl mx-auto w-full min-h-[calc(100vh-70px)] py-[30px]'>
      <form className="max-w-[600px]" onSubmit={(e) => generateImage(e)}>
        {
           formErr.status &&
          <p className={`font-normal ${formErr.status == "error" ? "text-red-300":"text-green-300"} text-[14px] my-4`}>
            {formErr.message}
          </p>
        }
        <label htmlFor="description" className="flex flex-col items-start flex-wrap mb-4">
          <span className="text-black font-base text-base md:text-lg mb-2">Please write your Description of Image to make Image</span>
          <textarea id="description" name="description" rows={2} placeholder="Please leave Image Description" className={`bg-white focus:bg-slate-100 text-black text-[16px] flex-1 w-full p-3 rounded-md border ${formErr.description ? "border-rose-500":"border-black"} outline-none placeholder:text-slate-300`} value={form.description} onChange={(e) => onTextareaChange(e)}/>                
        </label>
        <div className="my-10 w-[300px] h-[300px] border rounded flex justify-center items-center bg-[#00000033] z-0">
          {
            !loading ?
            <img src={ `${form.image}` } alt={form.description} className='z-10'/>
            :
            <div className='z-10'>
              <Loader/>
            </div>
          } 
        </div>
        {
          form.paymentId?
          <>
            <div className="flex justify-start">    
              { 
                <button type="submit" className='bg-slate-200 hover:bg-slate-400 border border-slate-500 z-100 px-4 py-3 flex flex-row gap-1 items-center rounded-lg text-black font-base text-[16px]' disabled={loading ? true : formErr.status == "image" ? true: formErr.status == "saving" ? true:false}>
                  {
                    !loading ?
                    "Load your Image"
                    :
                    <>
                    <span>Loading...</span><LoaderButton/>
                    </>
                  } 
                </button>
              }     
            </div>
            <div className="mt-6 p-3 bg-slate-200">
              <p className="mb-3">Saving generated image</p>
              <div className="flex justify-start">    
                { 
                  <button type="submit" className='bg-slate-200 hover:bg-slate-400 border border-slate-500 z-100 px-4 py-3 flex flex-row gap-1 items-center rounded-lg text-black font-base text-[16px]' disabled={saving ? true : formErr.status == "saving" ? true:false} onClick={(e) => saveImage(e)}>
                    {
                      !saving ?
                      "Saving Image"
                      :
                      <>
                      <span>saving...</span><LoaderButton />
                      </>
                    } 
                  </button>
                }     
              </div>
            </div>
          </>
          :
          <div className="flex justify-start">    
            <button type="button" className='bg-slate-200 hover:bg-slate-400 border border-slate-500 z-100 px-4 py-3 flex flex-row gap-1 items-center rounded-lg text-black font-base text-[16px]' onClick={() => setShowPapal(prevState => !prevState)}>
              Load your Image
            </button>  
          </div>   
        }
      </form>
      <PaypalModal status={showPapal} setShowPapal={setShowPapal} form={form} setForm={setForm}/>
    </div>
  )
}

export default Post
