package com.todoapp.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProfilePage {

    private WebDriver driver;

    // Account Menu
    private By accountMenuButton =
            By.cssSelector("[aria-label='Open account menu']");

    // Profile inside Account Menu
    private By profileButton =
            By.cssSelector("a[href='/profile']");

    // Change Password fields
    private By currentPassword =
            By.id("currentPassword");

    private By newPassword =
            By.id("newPassword");

    private By confirmPassword =
            By.id("confirmNewPassword");

    // Update Password
    private By updatePasswordButton =
            By.xpath("//button[normalize-space()='Update password']");

    // Logout
    private By logoutButton =
            By.xpath("//*[@role='menuitem' and normalize-space()='Log out']");


    public ProfilePage(WebDriver driver) {
        this.driver = driver;
    }


    // Open Account Menu
    public void openAccountMenu() {
        driver.findElement(accountMenuButton).click();
    }


    // Click Profile from Account Menu
    public void clickOnProfile() {
        driver.findElement(profileButton).click();
    }


    // Navigate to Profile Page
    public void openProfilePage() {
        openAccountMenu();
        clickOnProfile();
    }


    // Enter Current Password
    public void enterCurrentPassword(String password) {
        driver.findElement(currentPassword).sendKeys(password);
    }


    // Enter New Password
    public void enterNewPassword(String password) {
        driver.findElement(newPassword).sendKeys(password);
    }


    // Confirm New Password
    public void enterConfirmPassword(String password) {
        driver.findElement(confirmPassword).sendKeys(password);
    }


    // Update Password
    public void clickOnUpdatePassword() {
        driver.findElement(updatePasswordButton).click();
    }


    // Logout
    public void logout() {
        openAccountMenu();
        driver.findElement(logoutButton).click();
    }
}