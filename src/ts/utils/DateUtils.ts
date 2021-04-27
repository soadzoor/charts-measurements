export class DateUtils
{
	public static getHHMM()
	{
		const d = new Date();

		let h = d.getHours();
		let m = d.getMinutes();

		let hh = `${h}`;
		let mm = `${m}`;

		if (h < 10)
		{
			hh = `0${hh}`;
		}

		if (m < 10)
		{
			mm = `0${mm}`;
		}

		return `${hh}:${mm}`;
	}
}