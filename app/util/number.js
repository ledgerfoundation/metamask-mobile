/**
 * Collection of utility functions for consistent formatting and conversion
 */
import { BN } from 'ethereumjs-util';
import convert from 'ethjs-unit';
import gabaUtils from 'gaba/util';
import numberToBN from 'number-to-bn';
/**
 * Converts a BN object to a hex string with a '0x' prefix
 *
 * @param {Object} value - BN instance to convert to a hex string
 * @returns {string} - '0x'-prefixed hex string
 */
export function BNToHex(value) {
	return gabaUtils.BNToHex(value);
}

/**
 * Converts wei to a different unit
 *
 * @param {number|string|Object} value - Wei to convert
 * @param {string} unit - Unit to convert to, ether by default
 * @returns {string} - String containing the new number
 */
export function fromWei(value = 0, unit = 'ether') {
	return convert.fromWei(value, unit);
}

/**
 * Converts token minimal unit to readable string value
 *
 * @param {number|string|Object} minimalInput - Token minimal unit to convert
 * @param {string} decimals - Token decimals to convert
 * @returns {string} - String containing the new number
 */
export function fromTokenMinimalUnit(minimalInput, decimals) {
	let minimal = numberToBN(minimalInput);
	const negative = minimal.lt(new BN(0));
	const base = toBN(Math.pow(10, decimals).toString());

	if (negative) {
		minimal = minimal.mul(negative);
	}
	let fraction = minimal.mod(base).toString(10);
	while (fraction.length < decimals) {
		fraction = '0' + fraction;
	}
	fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
	const whole = minimal.div(base).toString(10);
	let value = '' + whole + (fraction === '0' ? '' : '.' + fraction);
	if (negative) {
		value = '-' + value;
	}
	return value;
}

/**
 * Converts some unit to token minimal unit
 *
 * @param {number|string|BN} tokenValue - Value to convert
 * @param {string} decimals - Unit to convert from, ether by default
 * @returns {Object} - BN instance containing the new number
 */
export function toTokenMinimalUnit(tokenValue, decimals) {
	const base = toBN(Math.pow(10, decimals).toString());
	let value = convert.numberToString(tokenValue);
	const negative = value.substring(0, 1) === '-';
	if (negative) {
		value = value.substring(1);
	}
	if (value === '.') {
		throw new Error('[number] while converting number ' + tokenValue + ' to token minimal util, invalid value');
	}
	// Split it into a whole and fractional part
	const comps = value.split('.');
	if (comps.length > 2) {
		throw new Error(
			'[number] while converting number ' + tokenValue + ' to token minimal util,  too many decimal points'
		);
	}
	let whole = comps[0],
		fraction = comps[1];
	if (!whole) {
		whole = '0';
	}
	if (!fraction) {
		fraction = '0';
	}
	if (fraction.length > decimals) {
		throw new Error(
			'[number] while converting number ' + tokenValue + ' to token minimal util, too many decimal places'
		);
	}
	while (fraction.length < decimals) {
		fraction += '0';
	}
	whole = new BN(whole);
	fraction = new BN(fraction);
	let tokenMinimal = whole.mul(base).add(fraction);
	if (negative) {
		tokenMinimal = tokenMinimal.mul(negative);
	}
	return new BN(tokenMinimal.toString(10), 10);
}

/**
 * Converts some token minimal unit to render format string, showing 5 decimals
 *
 * @param {Number|String|BN} tokenValue - Token value to convert
 * @param {Number} decimals - Token decimals to convert
 * @param {Number} decimalsToShow - Decimals to 5
 * @returns {String} - String of token minimal unit, in render format
 */
export function renderFromTokenMinimalUnit(tokenValue, decimals, decimalsToShow = 5) {
	const minimalUnit = fromTokenMinimalUnit(tokenValue, decimals);
	const base = Math.pow(10, decimalsToShow);
	const renderMinimalUnit = Math.round(parseFloat(minimalUnit) * base) / base;
	return renderMinimalUnit;
}

/**
 * Converts wei to render format string, showing 5 decimals
 *
 * @param {Number|String|BN} value - Wei to convert
 * @param {Number} decimalsToShow - Decimals to 5
 * @returns {String} - String of token minimal unit, in render format
 */
export function renderFromWei(value, decimalsToShow = 5) {
	const wei = fromWei(value);
	const base = Math.pow(10, decimalsToShow);
	const renderWei = Math.round(parseFloat(wei) * base) / base;
	return renderWei;
}

/**
 * Converts token BN value to hex string number to be sent
 *
 * @param {Object} value - BN instance to convert
 * @param {number} decimals - Decimals to be considered on the conversion
 * @returns {string} - String of the hex token value
 */
export function calcTokenValueToSend(value, decimals) {
	return value ? (value * Math.pow(10, decimals)).toString(16) : 0;
}

/**
 * Converts a hex string to a BN object
 *
 * @param {string} value - Number represented as a hex string
 * @returns {Object} - A BN instance
 */
export function hexToBN(value) {
	return gabaUtils.hexToBN(value);
}

/**
 * Checks if a value is a BN instance
 *
 * @param {*} value - Value to check
 * @returns {boolean} - True if the value is a BN instance
 */
export function isBN(value) {
	return BN.isBN(value);
}

/**
 * Determines if a string is a valid decimal
 *
 * @param {string} value - String to check
 * @returns {boolean} - True if the string is a valid decimal
 */
export function isDecimal(value) {
	return /^(\d+\.?\d*|\.\d+)$/.test(value);
}

/**
 * Creates a BN object from a string
 *
 * @param {string} value - Some numeric value represented as a string
 * @returns {Object} - BN instance
 */
export function toBN(value) {
	return new BN(value);
}

/**
 * Converts some unit to wei
 *
 * @param {number|string|BN} value - Value to convert
 * @param {string} unit - Unit to convert from, ether by default
 * @returns {Object} - BN instance containing the new number
 */
export function toWei(value, unit = 'ether') {
	return convert.toWei(value, unit);
}

/**
 * Converts some unit to Gwei
 *
 * @param {number|string|BN} value - Value to convert
 * @param {string} unit - Unit to convert from, ether by default
 * @returns {Object} - BN instance containing the new number
 */
export function toGwei(value, unit = 'ether') {
	return fromWei(value, unit) * 1000000000;
}

/**
 * Converts wei expressed as a BN instance into a human-readable fiat string
 *
 * @param {number} wei - BN corresponding to an amount of wei
 * @param {number} conversionRate - ETH to current currency conversion rate
 * @param {string} currencyCode - Current currency code to display
 * @returns {string} - Currency-formatted string
 */
export function weiToFiat(wei, conversionRate, currencyCode) {
	if (!wei || !isBN(wei)) {
		return `0.00 ${currencyCode}`;
	}
	const value = weiToFiatNumber(wei, conversionRate);
	return `${value} ${currencyCode}`;
}

/**
 * Converts wei expressed as a BN instance into a human-readable fiat string
 *
 * @param {number} wei - BN corresponding to an amount of wei
 * @param {number} conversionRate - ETH to current currency conversion rate
 * @param {Number} decimalsToShow - Decimals to 5
 * @returns {Number} - The converted balance
 */
export function weiToFiatNumber(wei, conversionRate, decimalsToShow = 5) {
	const base = Math.pow(10, decimalsToShow);
	const eth = fromWei(wei).toString();
	let value = parseFloat(Math.round(eth * conversionRate * base) / base);
	value = isNaN(value) ? 0.0 : value;
	return value;
}

/**
 * Calculates fiat balance of an asset
 *
 * @param {number} balance - Number corresponding to a balance of an asset
 * @param {number} conversionRate - ETH to current currency conversion rate
 * @param {number} exchangeRate - Asset to ETH conversion rate
 * @param {string} currencyCode - Current currency code to display
 * @returns {string} - Currency-formatted string
 */
export function balanceToFiat(balance, conversionRate, exchangeRate, currencyCode) {
	if (balance === undefined || balance === null || exchangeRate === undefined || exchangeRate === null) {
		return undefined;
	}
	const fiatFixed = balanceToFiatNumber(balance, conversionRate, exchangeRate);
	return `${fiatFixed} ${currencyCode.toUpperCase()}`;
}

/**
 * Calculates fiat balance of an asset and returns a number
 *
 * @param {number} balance - Number corresponding to a balance of an asset
 * @param {number} conversionRate - ETH to current currency conversion rate
 * @param {number} exchangeRate - Asset to ETH conversion rate
 * @param {Number} decimalsToShow - Decimals to 5
 * @returns {Number} - The converted balance
 */
export function balanceToFiatNumber(balance, conversionRate, exchangeRate, decimalsToShow = 5) {
	const base = Math.pow(10, decimalsToShow);
	let fiatFixed = parseFloat(Math.round(balance * conversionRate * exchangeRate * base) / base);
	fiatFixed = isNaN(fiatFixed) ? 0.0 : fiatFixed;
	return fiatFixed;
}
