import React from 'react';
import ReactDOM from 'react-dom';
import {Bar} from 'react-chartjs-2';
import {Pie} from 'react-chartjs-2';

class WarrantyDataLight extends React.Component {
	constructor(props) {
		super(props);		
		this.state = ({warrantyDataObject: [], Data: {}, 
						dealer: "", period: "", total: 0, warrantyTotalLabel: "", warrantyClass: "",  
						r1000DataObject: [],
						r1000Total: 0,
						r1000TotalLabel: "",
						r1000Class: "",
						elementId: this.props.elementId });	
		this.getWarrantyData = this.getWarrantyData.bind(this); 
		this.renderDetail = this.renderDetail.bind(this); 
		this.renderR1000Detail = this.renderR1000Detail.bind(this);     
		this.getWarrantyData(); 		
	}

renderDetail() {
	ReactDOM.unmountComponentAtNode(document.getElementById(this.state.elementId));
	ReactDOM.render(<WarrantyData elementId={this.state.elementId} />, document.getElementById(this.state.elementId));
}

renderR1000Detail() {
	ReactDOM.unmountComponentAtNode(document.getElementById(this.state.elementId));
	ReactDOM.render(<R1000Data elementId={this.state.elementId} />, document.getElementById(this.state.elementId));
}
  
  getWarrantyData() {
	  Liferay.Service(
		  '/jlr.r1000/get-r1000',
		  {

		  },
		  function(obj) {
			  console.log(obj);
			  var myObject = this.state.r1000DataObject;
			  myObject.splice(0, 6);
			  obj.map(someObjects => (myObject.push(someObjects)));			
			  this.setState(r1000DataObject = myObject);
			  console.log(this.state.r1000DataObject);
			  let r1000Label  = [];
			  let r1000Value = [];
			  let r1000Total = 0;
			  let r1000Class = "";
			  let r1000TotalLabel = "";	
			  let dealerValue = "";
			  let periodValue = "";		
			  this.state.r1000DataObject.forEach(element => {
					if (element.partCategory != "Warranty Total") {
						r1000Label.push(element.partCategory);
						r1000Value.push(element.percentage);
						dealerValue = element.dealer;
						periodValue = element.period;				
					}
					if (element.partCategory == "Warranty Total") {						
						r1000Total = element.percentage;
						if (r1000Total > 120) {
							r1000Class = "badge badge-danger";
							r1000TotalLabel = "Danger";
						}
						else if (r1000Total >= 110)
						{
							r1000Class = "badge badge-warning";
							r1000TotalLabel = "Warning";
						}
						else
						{
							r1000Class = "badge badge-success";
							r1000TotalLabel = "Success";
						}
					}
				});
				this.setState({r1000Total: r1000Total});
				this.setState({r1000Class: r1000Class});
				this.setState({r1000TotalLabel: r1000TotalLabel});
				this.setState({dealer : dealerValue});
				this.setState({period : periodValue});
				this.setState({ 
					Data: {
					labels: r1000Label,
					datasets:[
						{
							label:'Value by part category',
							data: r1000Value,
							backgroundColor:[
							'rgba(255,105,145,0.6)',
							'rgba(155,100,210,0.6)',
							'rgba(177,105,145,0.6)',
							'rgba(199,100,210,0.6)', 
							'rgba(208,100,210,0.6)',                      
						]
						}
					]
					}
				});	  
			  }.bind(this)
	  );
	  Liferay.Service(
		'/jlr.warranty/get-warranty',
		{

		},
		function(obj) {
			console.log(obj);
			var myObject = this.state.warrantyDataObject;
			myObject.splice(0, 6);
			obj.map(someObjects => (myObject.push(someObjects)));			
			this.setState(warrantyDataObject = myObject);
			console.log(this.state.warrantyDataObject);
			let warrantyLabel  = [];
			let warrantyValue	 = [];
			let warrantyTotal = 0;
			let warrantyClass = "";
			let warrantyTotalLabel = "";	
			let dealerValue = "";
			let periodValue = "";		
			this.state.warrantyDataObject.forEach(element => {
				  if (element.partCategory != "Warranty Total") {
					  warrantyLabel.push(element.partCategory);
					  warrantyValue.push(element.actualCost);
					  dealerValue = element.dealer;
					  periodValue = element.period;				
				  }
				  if (element.partCategory == "Warranty Total") {						
					  warrantyTotal = element.percentage;
					  if (warrantyTotal > 120) {
						  warrantyClass = "badge badge-danger";
						  warrantyTotalLabel = "Danger";
					  }
					  else if (warrantyTotal >= 110)
					  {
						  warrantyClass = "badge badge-warning";
						  warrantyTotalLabel = "Warning";
					  }
					  else
					  {
						  warrantyClass = "badge badge-success";
						  warrantyTotalLabel = "Success";
					  }
				  }
			  });
			  this.setState({total: warrantyTotal});
			  this.setState({warrantyClass: warrantyClass});
			  this.setState({warrantyTotalLabel: warrantyTotalLabel});
			  this.setState({dealer : dealerValue});
			  this.setState({period : periodValue});
			  this.setState({ 
				  Data: {
				  labels: warrantyLabel,
				  datasets:[
					  {
						  label:'Value by part category',
						  data: warrantyValue,
						  backgroundColor:[
						  'rgba(255,105,145,0.6)',
						  'rgba(155,100,210,0.6)',
						  'rgba(177,105,145,0.6)',
						  'rgba(199,100,210,0.6)',                     
					  ]
					  }
				  ]
				  }
			  });	  
			}.bind(this)
	);
  }



render() {
	  return (
		<div>
			<div style={{width: "45%", float: "left", margin: "10px"}}>	
				<h2>Cost per vehicle serviced</h2>
					<div>
						<div>
							<b>Overall:</b> {this.state.total}% <span className={this.state.warrantyClass}>{this.state.warrantyTotalLabel}</span>
						</div>
					</div>
					<div className="table-responsive">
					<table className="table table-striped">
						<tbody>
							{this.state.warrantyDataObject.map(warrantyDataObjects => (
								<tr>
								<td
								key={warrantyDataObjects.partCategory}>{warrantyDataObjects.partCategory}</td>
								<td><GetProgressBar progress={warrantyDataObjects.percentage}/></td>
								</tr>
							))}
						</tbody>
					</table>	
				</div>
				<a className="btn btn-primary" onClick={this.renderDetail}>Show detail</a>
			</div>
			<div style={{width: "45%", float: "left", margin: "10px"}}>	
				<h2>R1000 Report</h2>
					<div>
						<div>
							<b>Overall:</b> {this.state.r1000Total}% <span className={this.state.r1000Class}>{this.state.r1000TotalLabel}</span>
						</div>
					</div>
					<div className="table-responsive">
					<table className="table table-striped">
						<tbody>
							{this.state.r1000DataObject.map(r1000DataObjects => (
								<tr>
								<td
								key={r1000DataObjects.partCategory}>{r1000DataObjects.partCategory}</td>
								<td><GetProgressBar progress={r1000DataObjects.percentage}/></td>
								</tr>
							))}
						</tbody>
					</table>	
				</div>
				<a className="btn btn-primary" onClick={this.renderR1000Detail}>Show detail</a>
			</div>			 	
		</div>		  
	  );
	}


}

class WarrantyData extends React.Component {
	constructor(props) {
		super(props);						
		this.state = ({warrantyDataObject: [], Data: {}, dealer: "", period: "",  elementId: this.props.elementId });	
		this.renderDetail = this.renderDetail.bind(this);     
		this.getWarrantyData(); 		
	}

	renderDetail() {
		ReactDOM.unmountComponentAtNode(document.getElementById(this.state.elementId));
		ReactDOM.render(<WarrantyDataLight elementId={this.state.elementId} />, document.getElementById(this.state.elementId));
	}
  
  getWarrantyData() {
	  Liferay.Service(
		  '/jlr.warranty/get-warranty',
		  {

		  },
		  function(obj) {
			  console.log(obj);
			  var myObject = this.state.warrantyDataObject;
			  myObject.splice(0, 6);
			  obj.map(someObjects => (myObject.push(someObjects)));			
			  this.setState(warrantyDataObject = myObject);
			  console.log(this.state.warrantyDataObject);
			  let warrantyLabel  = [];
			  let warrantyValue	 = [];	
			  let dealerValue = "";
			  let periodValue = "";		
				this.state.warrantyDataObject.forEach(element => {
					if (element.partCategory != "Warranty Total") {
						warrantyLabel.push(element.partCategory);
						warrantyValue.push(element.actualCost);
						dealerValue = element.dealer;
						periodValue = element.period;				
					}
				});
				this.setState({dealer : dealerValue});
				this.setState({period : periodValue});
				this.setState({ 
					Data: {
					labels: warrantyLabel,
					datasets:[
						{
							label:'Value by part category',
							data: warrantyValue,
							backgroundColor:[
							'rgba(255,105,145,0.6)',
							'rgba(155,100,210,0.6)',
							'rgba(177,105,145,0.6)',
							'rgba(199,100,210,0.6)',                     
						]
						}
					]
					}
				});	  
			  }.bind(this)
	  );
  }

render() {
	  return (
		<div>
			<a className="btn btn-primary" onClick={this.renderDetail}>Go back</a>			
			<h4><b>Dealer:</b> {this.state.dealer}</h4>
			<h5><b>Period:</b> {this.state.period}</h5>
			<div className="table-responsive">
				<table className="table table-striped">
					<thead>
						<tr>
							<th>Category</th>
							<th>Actual Cost</th>
							<th>CPVS Code</th>
							<th>CPVS Percentage</th>
						</tr>
					</thead>
					<tbody>
						{this.state.warrantyDataObject.map(warrantyDataObjects => (
							<tr>
							<td
							key={warrantyDataObjects.partCategory}>{warrantyDataObjects.partCategory}</td>
							<td>£{warrantyDataObjects.actualCost}</td>
							<td>{warrantyDataObjects.conCode}</td>
							<td>{warrantyDataObjects.percentage}%</td>
							<td><GetProgressBar progress={warrantyDataObjects.percentage}/></td>
							</tr>
						))}
					</tbody>
				</table>	
			</div>			
			<Bar data={this.state.Data}
          options={{maintainAspectRatio: true}}/>
		  	<Pie data={this.state.Data}
          options={{maintainAspectRatio: true}}/>
		</div>		  
	  );
	}
}

class GetProgressBar extends React.Component {

	constructor(props) {
		super(props);
		let ceilProgressVar = Math.ceil(this.props.progress/100)*100
		let progressCssVar = (this.props.progress/ceilProgressVar)*100;
		this.state = ({progress: this.props.progress, progressCss: progressCssVar, ceilProgress: ceilProgressVar } );
	}

	render() {
		if(this.state.progress >= 120) {
			return <div className="progress">
				<div aria-valuenow={this.state.progress} aria-valuemin="0" aria-valuemax={this.state.ceilProgress} 
				className="active progress-bar progress-bar-striped progress-bar-danger" 
				role="progressbar" style={{width: this.state.progressCss + '%'}}>{this.state.progress}%</div>
			</div>
		}
		else if (this.state.progress >= 110) {
			return <div className="progress">
				<div aria-valuenow={this.state.progress} aria-valuemin="0" aria-valuemax={this.state.ceilProgress} 
				className="active progress-bar progress-bar-striped progress-bar-warning" 
				role="progressbar" style={{width: this.state.progressCss + '%'}}>{this.state.progress}%</div>
			</div>
		}
		else {
			return <div className="progress">
			<div aria-valuenow={this.state.progress} aria-valuemin="0" aria-valuemax={this.state.ceilProgress} 
			className="active progress-bar progress-bar-striped progress-bar-success" 
			role="progressbar" style={{width: this.state.progressCss + '%'}}>{this.state.progress}%</div>
			</div>
		}
	}	
	
}


class R1000Data extends React.Component {
	constructor(props) {
		super(props);						
		this.state = ({r1000DataObject: [], Data: {}, dealer: "", period: "",  elementId: this.props.elementId });	
		this.renderDetail = this.renderDetail.bind(this);     
		this.getWarrantyData(); 		
	}

	renderDetail() {
		ReactDOM.unmountComponentAtNode(document.getElementById(this.state.elementId));
		ReactDOM.render(<WarrantyDataLight elementId={this.state.elementId} />, document.getElementById(this.state.elementId));
	}


  
  getWarrantyData() {
	  Liferay.Service(
		  '/jlr.r1000/get-r1000',
		  {

		  },
		  function(obj) {
			  console.log(obj);
			  var myObject = this.state.r1000DataObject;
			  myObject.splice(0, 6);
			  obj.map(someObjects => (myObject.push(someObjects)));			
			  this.setState(r1000DataObject = myObject);
			  console.log(this.state.r1000DataObject);
			  let warrantyLabel  = [];
			  let warrantyValue	 = [];	
			  let dealerValue = "";
			  let periodValue = "";		
				this.state.r1000DataObject.forEach(element => {
					if (element.partCategory != "Warranty Total") {
						warrantyLabel.push(element.partCategory);
						warrantyValue.push(element.percentage);
						dealerValue = element.dealer;
						periodValue = element.period;				
					}
				});
				this.setState({dealer : dealerValue});
				this.setState({period : periodValue});
				this.setState({ 
					Data: {
					labels: warrantyLabel,
					datasets:[
						{
							label:'Percentage by part category',
							data: warrantyValue,
							backgroundColor:[
							'rgba(255,105,145,0.6)',
							'rgba(155,100,210,0.6)',
							'rgba(177,105,145,0.6)',
							'rgba(199,100,210,0.6)',  
							'rgba(215,100,210,0.6)'                    
						]
						}
					]
					}
				});	  
			  }.bind(this)
	  );
  }

render() {
	  return (
		<div>
			<a className="btn btn-primary" onClick={this.renderDetail}>Go back</a>			
			<h4><b>Dealer:</b> {this.state.dealer}</h4>
			<h5><b>Period:</b> {this.state.period}</h5>
			<div className="table-responsive">
				<table className="table table-striped">
					<thead>
						<tr>
							<th>Category</th>
							<th>Repair Count</th>
							<th>Visit Count</th>
							<th>Cond Code</th>
							<th>DLR % R1000</th>
							<th>DLR % RPR/VST</th>
							<th>DLR % VST/1000</th>
							
						</tr>
					</thead>
					<tbody>
						{this.state.r1000DataObject.map(r1000DataObjects => (
							<tr>
							<td key={r1000DataObjects.partCategory}>{r1000DataObjects.partCategory}</td>
							<td>{r1000DataObjects.repairCount}</td>
							<td>{r1000DataObjects.visitCount}</td>
							<td>{r1000DataObjects.conCode}%</td>
							<td><GetProgressBar progress={r1000DataObjects.percentage}/></td>
							<td>{r1000DataObjects.percentage1}%</td>
							<td>{r1000DataObjects.percentage2}%</td>
							</tr>
						))}
					</tbody>
				</table>	
			</div>			
			<Bar data={this.state.Data}
          options={{maintainAspectRatio: true}}/>
		  	<Pie data={this.state.Data}
          options={{maintainAspectRatio: true}}/>
		</div>		  
	  );
	}
}


export default function(elementId) {
		ReactDOM.render(<WarrantyDataLight elementId={elementId} />, document.getElementById(elementId));
}

			
