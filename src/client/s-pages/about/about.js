import React from 'react';

import Navbar from '../../components/navbar';

function AboutUsPage() {

  return(
    <div>
      <Navbar />

      <div style={{textAlign:'center', marginTop:'10px', fontSize:'1em'}}>
        About Sigmyze
      </div>

      <div className='aboutBody'>
        <div className='aboutTitle'>
          Our Mission
        </div>
        <div style={{marginBottom:'50px'}}>
          <p className='aboutPara' style={{fontSize:'1.1em', color:'rgb(153,204,255)'}}>
            Our mission is to <span className='aboutHighlight'>democratize data and analysis.</span>
          </p>
          <p className='aboutPara'>
            Our belief is that by enabling easy access to multiple datasets
            AND the ability to combine and analyze them easily and intuitively, everyone can be empowered to create their own powerful analysis and insights.
          </p>
        </div>
        <div className='aboutDivider'></div>
        <div className='aboutTitle'>
          What We Do
        </div>
        <div style={{marginBottom:'50px'}}>
          <p className='aboutPara'>
            Sigmyze is focused on enabling easy and quick access to multiple datasets on economy, society and markets.
            While most of these datasets are openly available, accessing them in one place and combining them effectively <span style={{fontStyle:'italic', fontWeight:'bold'}}> is hard. </span>
            <br/><br/>
            <span className='aboutHighlight'>
            Sigmyze does that hard work for you - combining multiple datasets, with beautiful visualizations, in one place - so you can focus on creating the insights that matter to you!
            </span>
            <br/><br/>
            <span style={{fontSize:'0.9em', fontStyle:'italic', color:'gray'}}>Designed to help answer questions ranging from the simple -- such as -- "What is the historical GDP trend for my country?" --to the more complex --
            such as -- "Is there a correlation between GDP growth, inflation, employment and income?" --or-- "How has Covid impacted employment in my state or county? In which sector?"
            </span>
          </p>
        </div>
        <div className='aboutDivider'></div>
        <div className='aboutTitle'>
          RoadMap
        </div>
        <div style={{marginBottom:'50px'}}>
          <p className='aboutPara'>
            We are in our very early days (think alpha release!) with a primary focus on datasets on economy and society.
            The platform currently provides access to 40+ indicators for 190+ countries from IMF WEO (World Economic Outlook) dataset.
          </p>
          <p className='aboutPara'>
            Future plans include bring World Bank datasets, Covid, national datasets on jobs, and others.
            In the not too distant future, our plans also include bringing access to markets data such as stock markets and crypto markets.
          </p>
        </div>

        <div className='aboutDivider'></div>

        <div className='aboutTitle'>
          Who We Are
        </div>
        <div style={{marginBottom:'50px'}}>
          <p className='aboutPara'>
            This is a passion project for us (we currently have other day jobs to help with the business of life!).
          </p>
          <p className='aboutPara'>
            Akshant Lanjewar - Techie & coder, intrepid taekwondo athlete, and high school senior. Dabbled in building a gaming PC and personal coding projects using React, HTML, JS, NodeJS, Express, C++, Python, etc.
          </p>
          <p className='aboutPara'>
            Rahul Lanjewar - tech and crypto enthusiast and geek at heart. Spent many years in tech consulting. Dabbled in tech transformation consulting, corporate strategy, financial analysis & simulations, and occasional programming.
          </p>
        </div>

        <div className='aboutDivider'></div>

        <div className='aboutTitle'>
          Contact Us
        </div>
        <div style={{marginBottom:'50px'}}>
          <p className='aboutPara'>
            <a href='mailto:sigmyze@gmail.com' style={{color:'white'}}>sigmyze@gmail.com</a>
          </p>
        </div>
      </div>

    </div>
  )
}

export default AboutUsPage
