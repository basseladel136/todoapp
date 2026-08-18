package com.todoapp.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;


public class LoginPage {
    private WebDriver driver;
    //write email
    private By emailInput =
            By.id("login-email");
    //write password
    private By passwordInput =
            By.id("login-password");
    //click enter
    private By submitButton =
            By.cssSelector("[data-testid='submit']");

    private By createAccountLink =
            By.cssSelector("[data-testid='signup']");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public void enterEmail(String email) {
        driver.findElement(emailInput).sendKeys(email);
    }

    public void enterPassword(String password) {
        driver.findElement(passwordInput).sendKeys(password);
    }

    public void clickSubmitButton() {
        driver.findElement(submitButton).click();
    }

    public void clickCreateAccount() {
        driver.findElement(createAccountLink).click();
    }

}
