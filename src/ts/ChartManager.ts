import {Chart, registerables} from "chart.js";
import {DateUtils} from "utils/DateUtils";

export class ChartManager
{
	private _container: HTMLElement = document.getElementById("playGround");
	private _canvas: HTMLCanvasElement = document.createElement("canvas");
	private _chart: Chart;

	constructor()
	{
		Chart.register(...registerables);

		this._container.appendChild(this._canvas);

		const firstValue = this.getNextValues();

		this._chart = new Chart(
			this._canvas,
			{
				type: "line",
				data: {
					labels: [firstValue.timeStamp],
					datasets: [
						{
							data: [firstValue.electric],
							label: "Electric Energy Consumption (W)",
							borderColor: "rgba(0, 0, 220, 1)",
							backgroundColor: "rgba(0, 0, 220, 0.2)",
							tension: 0.2
						},
						{
							data: [firstValue.gas],
							label: "Gas Consumption (m³)",
							borderColor: "rgba(220, 220, 0, 1)",
							backgroundColor: "rgba(220, 220, 0, 0.2)",
							tension: 0.2
						}
					]
				},
				options: {
					responsive: true
				}
			}
		);

		this.update();
	}

	private update = () =>
	{
		const nextValues = this.getNextValues();
		this._chart.data.labels.push(nextValues.timeStamp);

		const electricData = this.getData("electric");
		const gasData = this.getData("gas");
		const multiplicatorE = 1 / 500 * Math.sign(Math.random() < 0.5 ? -1 : 1);
		const multiplicatorG = 1 / 500 * Math.sign(Math.random() < 0.5 ? -1 : 1);
		electricData.push(electricData[electricData.length - 1] as number + nextValues.electric * multiplicatorE);
		gasData.push(gasData[gasData.length - 1] as number + nextValues.gas * multiplicatorG);

		const dataLimit = 100;

		if (this._chart.data.labels.length > dataLimit)
		{
			this._chart.data.labels.shift();
		}

		if (electricData.length > dataLimit)
		{
			for (const dataset of this._chart.data.datasets)
			{
				dataset.data[0] = dataset.data[1];
				dataset.data.splice(1, 1);
			}
		}

		this._chart.update("none");

		setTimeout(this.update, 500);
	};

	private getData(type: "electric" | "gas")
	{
		let index = 0;

		switch (type)
		{
			case "electric":
				index = 0;
				break;
			case "gas":
				index = 1;
				break;
		}
		
		return this._chart.data.datasets[index].data;
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