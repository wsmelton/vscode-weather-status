import * as vscode from 'vscode';
var weather = require('openweather-apis');

const APPID = 'd50b7c190fbb5b85029c36efc346abad'
let myWeatherStatusBarItem: any;

async function getWeatherData(zip: string) {
    let barWeatherString = 'Currently: ';

    const { zipcode, unit: weatherConfig } = vscode.workspace.getConfiguration('weather');

    // will set output of weather to environment language
    let env_lang = vscode.env.language
    let weather_lang = env_lang.split('-')[0]

    weather.setLang(weather_lang);

    let unitString: string = 'F';
    if (weatherConfig.unit = 'F') {
        weather.setUnits('imperial');
    }
    if (weatherConfig.unit == 'C') {
        weather.setUnits('metric');
        unitString = 'C'
    }

    if (weatherConfig.zipcode) {
        weather.setzip(zipcode);
    }

    weather.setAPPID(APPID);

    // get weather json object
    weather.getAllWeather(function (err: string, jsonObj: any) {

        if (!err) {
            let temp = jsonObj.main.temp;
            let sky = jsonObj.weather[0].main;
            let weather_icon = jsonObj.weather[0].icon;

            console.log('weather-status temp: ${temp}');
            console.log('weather-status sky: ${sky}');
            console.log('weather-status weather_icon: ${weather_icon}');
            barWeatherString = `${barWeatherString} ${temp}°${unitString}`;
        } else {
            vscode.window.showErrorMessage(err);
        }
        return barWeatherString;
    });
}

async function display() {
    if (!myWeatherStatusBarItem) {
        myWeatherStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    }
    myWeatherStatusBarItem.text = await getWeatherData('36116');
    myWeatherStatusBarItem.show();
}

export async function activate(context: vscode.ExtensionContext) {
    await display();
    let disposable = vscode.commands.registerCommand('weather-status.refresh', async () => {
        await display();
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}