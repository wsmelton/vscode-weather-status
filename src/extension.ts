import * as vscode from 'vscode';
var weatherData = require('openweather-apis');

const APPID = '3fb0fcedf0e65093de7cce2bd68fecab'
let myWeatherStatusBarItem: any;

export function activate({ subscriptions }: vscode.ExtensionContext) {

    const cmdId = 'weather-status.refresh'
    subscriptions.push(vscode.commands.registerCommand(cmdId, () => {
        display();
    }));
    myWeatherStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    myWeatherStatusBarItem.command = cmdId;

    subscriptions.push(myWeatherStatusBarItem);

    display();
}

function getWeatherString(): string {
    let barWeatherString: string = 'Currently: ';
    let finalResult: string = '';
    const weatherConfigUnit = vscode.workspace.getConfiguration().get('weather.unit');
    const weatherConfigZip = vscode.workspace.getConfiguration().get('weather.zipcode');

    // will set output of weather to environment language
    let env_lang = vscode.env.language
    let weather_lang = env_lang.split('-')[0]

    weatherData.setLang(weather_lang);

    switch (weatherConfigUnit) {
        case 'C':
            weatherData.setUnits('metrics');
        case 'F':
            weatherData.setUnits('imperial');
    }

    weatherData.setZipCode(weatherConfigZip);
    weatherData.setAPPID(APPID);

    // get weather json object
    weatherData.getAllWeather(function (err: string, jsonObj: any): any {
        if (!err) {
            let temp = jsonObj.main.temp;
            let sky = jsonObj.weather[0].main;
            let locationName = jsonObj.name;
            let weather_icon = jsonObj.weather[0].icon;

            //build path to icon file
            let iconPath = './weathericons/' + weather_icon + '@2x.png';

            let weatherString = `${temp}°${weatherConfigUnit} - ${locationName}`;
            console.log(weatherString);
            finalResult = barWeatherString + weatherString;
            console.log(finalResult);
        } else {
            vscode.window.showErrorMessage(err);
        }
    });
    return finalResult;
}

function display() {
    myWeatherStatusBarItem.text = getWeatherString();
    myWeatherStatusBarItem.show();
}

// this method is called when your extension is deactivated
export function deactivate() { }