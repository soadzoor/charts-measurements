import ApexCharts from "apexcharts";
import {DateUtils} from "utils/DateUtils";

interface ISeries
{
	name: string;
	data: number[];
}

export class ChartManager
{
	private _container: HTMLElement = document.getElementById("chart");
	private _chart: ApexCharts;

	private _timeStamps: string[] = [];

	private _electricSeries: ISeries = {
		name: "Electric Consumption (W)",
		data: []
	};

	private _gasSeries: ISeries = {
		name: "Gas Consumption (m³ / h)",
		data: []
	};

	constructor()
	{
		const firstValue = this.getNextValues();

		this._timeStamps.push(firstValue.timeStamp);
		this._electricSeries.data.push(firstValue.electric);
		this._gasSeries.data.push(firstValue.gas);

		this._chart = new ApexCharts(
			this._container,
			this.chartOptions
		);

		this._chart.render();

		setInterval(() =>
		{
			const nextValues = this.getNextValues();
			this._timeStamps.push(nextValues.timeStamp);

			const multiplicatorE = 1 / 500 * Math.sign(Math.random() < 0.5 ? -1 : 1);
			const multiplicatorG = 1 / 500 * Math.sign(Math.random() < 0.5 ? -1 : 1);
			this._electricSeries.data.push(this._electricSeries.data[this._electricSeries.data.length - 1] + nextValues.electric * multiplicatorE);
			this._gasSeries.data.push(this._gasSeries.data[this._gasSeries.data.length - 1] + nextValues.gas * multiplicatorG);

			const dataLimit = 10;

			if (this._timeStamps.length > dataLimit)
			{
				this._timeStamps.shift();
			}

			if (this._electricSeries.data.length > dataLimit)
			{
				this._electricSeries.data.shift();
			}

			if (this._gasSeries.data.length > dataLimit)
			{
				this._gasSeries.data.shift();
			}

			this._chart.updateSeries([this._electricSeries, this._gasSeries]);

		}, 16);
	}

	private get chartOptions()
	{
		return {
			chart: {
				type: "line",
				height: "100%",
				animations: {
					enabled: false,
					// easing: "linear",
					// dynamicAnimation: {
					// 	speed: 1000
					// }
				},
				toolbar: {
					show: false
				},
				zoom: {
					enabled: false
				}
			},
			stroke: {
				curve: "smooth",
			},
			dataLabels: {
				enabled: false
			},
			colors: [
				"#0000FE",
				"#FEFE00"
			],
			series: [
				this._electricSeries,
				this._gasSeries
			],
			xaxis: {
				categories: this._timeStamps
			},
			yaxis: {
				decimalsInFloat: 2
			}
		};
	}

	private getNextValues()
	{
		return {
			timeStamp: DateUtils.getHHMMSS(),
			electric: Math.random() * 100,
			gas: Math.random() * 100
		};
	}
}