import {Chart, registerables, UpdateModeEnum} from "chart.js";
import {DateUtils} from "utils/DateUtils";

export class ChartManager
{
	private _container: HTMLElement = document.getElementById("playGround");
	private _canvas: HTMLCanvasElement = document.createElement("canvas");
	private _ctx: CanvasRenderingContext2D = this._canvas.getContext("2d");
	private _chart: Chart;

	constructor()
	{
		Chart.register(...registerables);

		this._container.appendChild(this._canvas);

		const firstValue = this.getNextValues();

		this._chart = new Chart(
			this._ctx,
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
							fill: false,
						},
						{
							data: [firstValue.gas],
							label: "Gas Consumption (m³)",
							borderColor: "rgba(220, 220, 0, 1)",
							backgroundColor: "rgba(220, 220, 0, 0.2)",
							fill: false
						}
					]
				}
			}
		);

		setInterval(() =>
		{
			const nextValues = this.getNextValues();
			this._chart.data.labels.push(nextValues.timeStamp);

			const electricData = this.getData("electric");
			const gasData = this.getData("gas");
			electricData.push(electricData[electricData.length - 1] as number + nextValues.electric / 50 * Math.sign(Math.random() < 0.5 ? -1 : 1));
			gasData.push(gasData[gasData.length - 1] as number + nextValues.gas / 50 * Math.sign(Math.random() < 0.5 ? -1 : 1));
			this._chart.update();
		}, 1000);
	}

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
			timeStamp: DateUtils.getHHMM(),
			electric: Math.random() * 100,
			gas: Math.random() * 100
		};
	}
}