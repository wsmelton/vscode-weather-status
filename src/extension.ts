import * as vscode from 'vscode';
var weatherData = require('openweather-apis');

const APPID = 'd50b7c190fbb5b85029c36efc346abad'
let myWeatherStatusBarItem: any;

export function activate({ subscriptions }: vscode.ExtensionContext) {

    const cmdId = 'weather-status.refresh'
    subscriptions.push(vscode.commands.registerCommand(cmdId, () => {
        display();
    }));
    myWeatherStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    myWeatherStatusBarItem.command = cmdId;

    subscriptions.push(myWeatherStatusBarItem);

    display();
}

function getWeatherData() {
    let barWeatherString = 'Currently: ';

    const weatherConfigUnit = vscode.workspace.getConfiguration().get('weatherData.unit');
    const weatherConfigZip = vscode.workspace.getConfiguration().get('weatherData.zipcode');

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
    weatherData.getAllWeather(function (err: string, jsonObj: any) {
        if (!err) {
            let temp = jsonObj.main.temp;
            let sky = jsonObj.weather[0].main;
            let locationName = jsonObj.name;
            let weather_icon = jsonObj.weather[0].icon;

            barWeatherString += `${temp}°${weatherConfigUnit}`;
            console.log(barWeatherString);
        } else {
            vscode.window.showErrorMessage(err);
        }
        return barWeatherString;
    });
}

function display() {
    myWeatherStatusBarItem.text = getWeatherData();
    myWeatherStatusBarItem.show();
}

// this method is called when your extension is deactivated
export function deactivate() { }