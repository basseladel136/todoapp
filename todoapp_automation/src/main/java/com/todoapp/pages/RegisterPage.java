package com.todoapp.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class RegisterPage {

    private WebDriver driver;
    private WebDriverWait wait;

    private By firstNameField = By.id("signup-firstName");
    private By lastNameField = By.id("signup-lastName");
    private By emailField = By.id("signup-email");
    private By passwordField = By.id("signup-password");
    private By confirmPasswordField = By.id("signup-confirmPassword");

    // هنحدد ده بعد ما تبعت HTML بتاع الزر
    private By createAccountButton =
            By.cssSelector("[data-testid='submit']");

    public RegisterPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void fillFirstName(String firstName) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(firstNameField))
                .sendKeys(firstName);
    }

    public void fillLastName(String lastName) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(lastNameField))
                .sendKeys(lastName);
    }

    public void fillEmail(String email) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(emailField))
                .sendKeys(email);
    }

    public void fillPassword(String password) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(passwordField))
                .sendKeys(password);
    }

    public void fillConfirmPassword(String confirmPassword) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(confirmPasswordField))
                .sendKeys(confirmPassword);
    }

    public void clickCreateAccount() {
        wait.until(ExpectedConditions.elementToBeClickable(createAccountButton))
                .click();
    }
}