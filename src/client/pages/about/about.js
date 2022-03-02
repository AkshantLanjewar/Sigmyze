import React from 'react';

import { IoIosAnalytics } from 'react-icons/io'
import { BiBadgeCheck, BiBarChartSquare, BiNews } from 'react-icons/bi'
import { AiFillDatabase, AiFillRobot, AiFillPhone } from 'react-icons/ai'
import { GrCloudComputer } from 'react-icons/gr'
import { RiFilePaper2Fill } from 'react-icons/ri'
import { BsPersonFill } from 'react-icons/bs'
import { HiOutlineMail } from 'react-icons/hi'
import { FaTelegramPlane } from 'react-icons/fa'

function Event(props) {
	return (
		<div className='event'>
			<div className='content'>
				<div className='icon'>
					{props.icon}
				</div>

				<div className='text'>
					<h6>{props.name}</h6>
					<p>
						{props.desc}
					</p>
				</div>
			</div>
		</div>
	)
} 

function ContactUsForm() {
	return (
		<div className='row contact'>
			<div className='body'>
				<form>
					<div className='form'>
						<div className='part'>
							<div className='group'>
								<label>
									First Name
									<span className='danger'>*</span>
								</label>

								<div className='input'>
									<div className='icon'>
										<span><BsPersonFill /></span>
									</div>

									<input placeholder='First Name' type={"text"} required />
								</div>
							</div>
						</div>

						<div className='part'>
							<div className='group'>
								<label>
									Last Name
									<span className='danger'>*</span>
								</label>

								<div className='input'>
									<div className='icon'>
										<span><BsPersonFill /></span>
									</div>

									<input placeholder='Last Name' type={"text"} required />
								</div>
							</div>
						</div>

						<div className='part'>
							<div className='group'>
								<label>
									E-Mail
									<span className='danger'>*</span>
								</label>

								<div className='input'>
									<div className='icon'>
										<span><HiOutlineMail /></span>
									</div>

									<input placeholder='E-Mail' type={"email"} required />
								</div>
							</div>
						</div>

						<div className='part'>
							<div className='group'>
								<label>
									Phone Number
									<span className='danger'>*</span>
								</label>

								<div className='input'>
									<div className='icon'>
										<span><AiFillPhone /></span>
									</div>

									<input placeholder='Phone Number' type={"number"} required />
								</div>
							</div>
						</div>

						<div className='submit'>
							<div className='group'>
								<label>
									How can we help you?
									<span className='danger'>*</span>
								</label>

								<div className='input area'>
									<textarea placeholder='Hi Sigmyze, I would like to...' rows={8} required />
								</div>
							</div>

							<div className='btn'>
								<button type='submit'>
									<FaTelegramPlane />
									<span>Send Message</span>
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

function AboutUsPage() {

	return (
		<div className='info-page'>
			<section className='dark'>
				<div className='inner'>
					<h1 style={{
						marginBottom: "1rem",
						textAlign: "center"}}>
							Who is Sigmyze for?
					</h1>

					<p>
						Whether you are a Data Analyst, Student, or Hobbyist, 
						Sigmyze has got your needs covered. 
					</p>
				</div>
			</section>

			<section className='wave'>
				<div className='card-container'>
					<div className="row">
						<div className='card'>
							<div className='header'>
								<div className='circle-icon'>
									<IoIosAnalytics />
								</div>

								<h4 className='text-block'>Analysis</h4>
								<p>Understand and find insights from existing data</p>
							</div>

							<div className='body'>
								<ul>
									<li>
										<BiBadgeCheck />
										<div>
											Complex Analysis
										</div>
									</li>

									<li>
										<BiBadgeCheck />
										<div>
											Wide Variety of Data
										</div>
									</li>
								</ul>
							</div>
						</div>

						<div className='card'>
							<div className='header'>
								<div className='circle-icon'>
									<BiBarChartSquare />
								</div>

								<h4 className='text-block'>Charting</h4>
								<p>Visualise and Display your Data</p>
							</div>

							<div className='body'>
								<ul>
									<li>
										<BiBadgeCheck />
										<div>
											Powerful Charting Tools
										</div>
									</li>

									<li>
										<BiBadgeCheck />
										<div>
											Multi Line Charts
										</div>
									</li>

									<li>
										<BiBadgeCheck />
										<div>
											Variety of Chart Types
										</div>
									</li>
								</ul>
							</div>
						</div>

						<div className='card'>
							<div className='header'>
								<div className='circle-icon'>
									<AiFillDatabase />
								</div>

								<h4 className='text-block'>Data</h4>
								<p>Access a wide variety of precleaned data</p>
							</div>

							<div className='body'>
								<ul>
									<li>
										<BiBadgeCheck />
										<div>
											Cleaned Data
										</div>
									</li>

									<li>
										<BiBadgeCheck />
										<div>
											Wide Variety of Datatypes
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className='light'>
				<div className='inner b-line'>
					<div className='row title'>
						<h1>Roadmap</h1>
						
						<p>
							See what features we are working on right now
						</p>
					</div>

					<div className='row roadmap'>
						<div className='node'>
							<div className='time'>
								<p>Near Future</p>
							</div>

							<div className='events'>
								<Event 
									icon={<AiFillDatabase />} 
									name={"World Bank Data"}
									desc={"Integrating the world bank data into our hosted datasets"} />
								<Event 
									icon={<BiBarChartSquare />} 
									name={"Custom Data"}
									desc={"Ability to bring your own data to charting platform"} />
								<Event 
									icon={<BiNews />} 
									name={"Blog"}
									desc={"Add a Sigmyze blog for easier communication"} />
							</div>
						</div>

						<div className='node'>
							<div className='time'>
								<p>Next Year</p>
							</div>

							<div className='events'>
								<Event 
									icon={<GrCloudComputer />} 
									name={"Analytics"}
									desc={"Add data analytics and simulations"} />
								<Event 
									icon={<RiFilePaper2Fill />} 
									name={"Documents"}
									desc={"Create a document system that integrates data"} />
								<Event 
									icon={<AiFillRobot />} 
									name={"Artifical Intelligence"}
									desc={"Add basic artifical intelligence / ML"} />
							</div>
						</div>
					</div>
				</div>

				<div className='inner' style={{ marginTop: "2rem" }}>
					<div className='row title'>
						<h1>Contact Us</h1>
						
						<p>
							Send us a message with any questions you may have
						</p>
					</div>

					<ContactUsForm />
				</div>
			</section>
		</div>
	)
}

export default AboutUsPage
