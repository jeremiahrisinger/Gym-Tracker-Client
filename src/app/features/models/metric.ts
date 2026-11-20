
export interface Metric {
	_id?: number;
	weight?: number;
	reps?: number;
	rpe?: number;
	pauseTop?: number;
	pauseMiddle?: number;
	pauseBottom?: number;
	ecentricTempo?: number;
	concentricTempo?: number;
}

export function isMetricMatch(target: Metric | undefined , actual: Metric | undefined): boolean {
	if (!target || target === undefined) {
		return true;
	}
	if (!actual || actual === undefined) {
		return false;
	}

	if ((target.reps || 0) > (actual.reps || 0)) {
		return false;
	}
	if ((target.weight || 0) > (actual.weight || 0)) {
		return false;
	}
	if ((target.pauseTop || 0) > (actual.pauseTop|| 0)
		|| (target.pauseMiddle|| 0) > (actual.pauseMiddle|| 0)
		|| (target.pauseBottom|| 0) > (actual.pauseBottom|| 0)) {
		return false;
	}
	if ((target.ecentricTempo || 0) > (actual.ecentricTempo|| 0)
		|| (target.concentricTempo|| 0) > (actual.concentricTempo|| 0)) {
		return false;
	}

	return true;
}