export class DateUtils
{
	public static getHHMMSS()
	{
		const d = new Date();

		let h = d.getHours();
		let m = d.getMinutes();
		let s = d.getSeconds();

		let hh = `${h}`;
		let mm = `${m}`;
		let ss = `${s}`;

		if (h < 10)
		{
			hh = `0${hh}`;
		}

		if (m < 10)
		{
			mm = `0${mm}`;
		}

		if (s < 10)
		{
			ss = `0${s}`;
		}

		return `${hh}:${mm}:${ss}`;
	}
}