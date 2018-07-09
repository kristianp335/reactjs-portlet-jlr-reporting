import React from 'react';
import ReactDOM from 'react-dom';
import {Bar} from 'react-chartjs-2';
import {Pie} from 'react-chartjs-2';

class WarrantyDataLight extends React.Component {
	constructor(props) {
		super(props);		
		this.state = ({warrantyDataObject: [], Data: {}, dealer: "", period: "", total: 0, warrantyTotalLabel: "", warrantyClass: "",  elementId: this.props.elementId });	
		this.getWarrantyData = this.getWarrantyData.bind(this); 
		this.renderDetail = this.renderDetail.bind(this);   
		this.getWarrantyData(); 		
	}

renderDetail() {
	ReactDOM.unmountComponentAtNode(document.getElementById(this.state.elementId));
	ReactDOM.render(<WarrantyData elementId={this.state.elementId} />, document.getElementById(this.state.elementId));
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
			<h2>Cost per vehicle serviced</h2>
				<div>
					<div>
						<b>Overall:</b> {this.state.total}% <span className={this.state.warrantyClass}>{this.state.warrantyTotalLabel}</span>
					</div>
				</div>
				<div className="table-responsive">
				<table style={{"max-width": "65%"}} className="table table-striped">
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


export default function(elementId) {
		ReactDOM.render(<WarrantyDataLight elementId={elementId} />, document.getElementById(elementId));
}

			
