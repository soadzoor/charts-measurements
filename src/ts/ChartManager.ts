import {Chart, bb, spline} from "billboard.js";

interface ISeries
{
	name: string;
	color: string;
	data: number[];
}

export class ChartManager
{
	private _container: HTMLElement = document.getElementById("chart");
	private _chart: Chart;

	private readonly _dataLimit: number = 10;

	private _timeStamps: number[] = [];

	private _electricSeries: ISeries = {
		name: "Electric Consumption (W)",
		color: "#0000EF",
		data: new Array(this._dataLimit)
	};

	private _gasSeries: ISeries = {
		name: "Gas Consumption (m³ / h)",
		color: "#EFEF00",
		data: new Array(this._dataLimit)
	};

	constructor()
	{
		const firstValue = this.getNextValues();

		for (let i = 0; i < this._dataLimit; ++i)
		{
			this._timeStamps.push(firstValue.timeStamp);
		}

		for (let i = 0; i < this._electricSeries.data.length; ++i)
		{
			this._electricSeries.data[i] = firstValue.electric;
		}

		for (let i = 0; i < this._gasSeries.data.length; ++i)
		{
			this._gasSeries.data[i] = firstValue.gas;
		}


		this._chart = bb.generate(
			{
				bindto: this._container,
				data: {
					x: "x",
					columns: [
						["x", ...this._timeStamps],
						[this._electricSeries.name, ...this._electricSeries.data],
						[this._gasSeries.name, ...this._gasSeries.data]
					],
					colors: {
						[this._electricSeries.name]: this._electricSeries.color,
						[this._gasSeries.name]: this._gasSeries.color
					},
					type: spline()
				},
				axis: {
					x: {
						type: "timeseries",
						tick: {
							format: "%H:%M:%S",
							autorotate: true,
							culling: false
						},
						label: {
							text: "Time",
							position: "outer-center",
						}
					}
				}
			}
		);

		setInterval(() =>
		{
			const nextValues = this.getNextValues();
			//this._timeStamps.push(nextValues.timeStamp);

			const multiplicatorE = 1 / 50 * Math.sign(Math.random() < 0.5 ? -1 : 1);
			const multiplicatorG = 1 / 50 * Math.sign(Math.random() < 0.5 ? -1 : 1);
			const newElectricValue = this._electricSeries.data[this._electricSeries.data.length - 1] + nextValues.electric * multiplicatorE;
			const newGasValue = this._gasSeries.data[this._gasSeries.data.length - 1] + nextValues.gas * multiplicatorG;

			this._chart.flow({
				columns: [
					["x", new Date().getTime()],
					[this._electricSeries.name, newElectricValue],
					[this._gasSeries.name, newGasValue]
				]
			});

		}, 1000);
	}

	private getNextValues()
	{
		return {
			timeStamp: new Date().getTime(),
			electric: Math.random() * 100,
			gas: Math.random() * 100
		};
	}
}