package com.todoapp.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.Random;

public class TodoPage {

    private WebDriver driver;
    private WebDriverWait wait;

    // =========================
    // Add Todo
    // =========================

    private By newTodoInput =
            By.cssSelector("[data-testid='new-todo']");

    private By addTodoButton =
            By.cssSelector("[data-testid='submit-newTask']");

    // =========================
    // Todo Item
    // =========================

    private By todoItems =
            By.cssSelector("[data-testid='todo-item']");

    // =========================
    // Empty State
    // =========================

    private By noTodosMessage =
            By.cssSelector("[data-testid='no-todos']");

    // =========================
    // Delete Success Message
    // =========================

    private By deleteSuccessMessage =
            By.cssSelector(
                    "li[data-sonner-toast] div[data-title]"
            );

    public TodoPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(10)
        );
    }

    // =========================
    // Add Todo
    // =========================

    public void enterTodo(String todo) {

        WebElement input = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        newTodoInput
                )
        );

        input.clear();
        input.sendKeys(todo);
    }

    public void clickAddTodo() {

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        addTodoButton
                )
        ).click();
    }

    public void addTodo(String todo) {

        enterTodo(todo);
        clickAddTodo();

        wait.until(driver ->
                isTodoDisplayed(todo)
        );
    }

    // =========================
    // Todo List
    // =========================

    public List<WebElement> getTodoItems() {

        return driver.findElements(todoItems);
    }

    public boolean isTodoDisplayed(String todoText) {

        List<WebElement> todos =
                driver.findElements(todoItems);

        for (WebElement todo : todos) {

            if (todo.getText().contains(todoText)) {
                return true;
            }
        }

        return false;
    }

    // =========================
    // Complete Todo
    // =========================

    public String completeRandomTodo() {

        List<WebElement> todos = wait.until(
                ExpectedConditions.visibilityOfAllElementsLocatedBy(
                        todoItems
                )
        );

        Random random = new Random();

        WebElement randomTodo =
                todos.get(random.nextInt(todos.size()));

        WebElement checkbox = randomTodo.findElement(
                By.cssSelector("button[role='checkbox']")
        );

        String todoText = checkbox
                .getAttribute("aria-label")
                .replace("Mark \"", "")
                .replace("\" as completed", "");

        // لو الـ Todo already completed
        if ("true".equals(
                checkbox.getAttribute("aria-checked")
        )) {
            return completeRandomTodo();
        }

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        checkbox
                )
        ).click();

        // Wait until THIS Todo becomes completed
        wait.until(driver -> {

            try {

                WebElement currentTodo = driver.findElement(
                        By.xpath(
                                "//*[@data-testid='todo-item']" +
                                        "[contains(.,'" +
                                        todoText +
                                        "')]"
                        )
                );

                WebElement currentCheckbox =
                        currentTodo.findElement(
                                By.cssSelector(
                                        "button[role='checkbox']"
                                )
                        );

                return "checked".equals(
                        currentCheckbox.getAttribute(
                                "data-state"
                        )
                );

            } catch (Exception e) {

                return false;
            }
        });

        return todoText;
    }

    public boolean isTodoCompleted(String todoText) {

        List<WebElement> todos =
                driver.findElements(todoItems);

        for (WebElement todo : todos) {

            if (todo.getText().contains(todoText)) {

                WebElement checkbox =
                        todo.findElement(
                                By.cssSelector(
                                        "button[role='checkbox']"
                                )
                        );

                return "checked".equals(
                        checkbox.getAttribute(
                                "data-state"
                        )
                );
            }
        }

        return false;
    }

    // =========================
    // Delete ANY Todo
    // =========================

    public String deleteRandomTodo() {

        List<WebElement> todos = wait.until(
                ExpectedConditions.visibilityOfAllElementsLocatedBy(
                        todoItems
                )
        );

        if (todos.isEmpty()) {
            throw new RuntimeException(
                    "No Todo available to delete"
            );
        }

        Random random = new Random();

        WebElement randomTodo =
                todos.get(random.nextInt(todos.size()));

        // Get Todo text before deleting
        String todoText = randomTodo.getText().trim();

        WebElement deleteButton = randomTodo.findElement(
                By.cssSelector(
                        "button[aria-label^='Delete ']"
                )
        );

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        deleteButton
                )
        ).click();

        return todoText;
    }

    // =========================
    // Delete Todo By Text
    // =========================

    public void deleteTodo(String todoText) {

        List<WebElement> todos =
                driver.findElements(todoItems);

        for (WebElement todo : todos) {

            if (todo.getText().contains(todoText)) {

                WebElement deleteButton =
                        todo.findElement(
                                By.cssSelector(
                                        "button[aria-label^='Delete ']"
                                )
                        );

                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                deleteButton
                        )
                ).click();

                return;
            }
        }

        throw new RuntimeException(
                "Todo not found: " + todoText
        );
    }

    // =========================
    // Delete Success Message
    // =========================

    public boolean isDeleteSuccessMessageDisplayed() {

        return wait.until(driver -> {

            List<WebElement> messages =
                    driver.findElements(
                            deleteSuccessMessage
                    );

            for (WebElement message : messages) {

                if (message.isDisplayed()
                        && message.getText()
                        .trim()
                        .equals("Todo deleted")) {

                    return true;
                }
            }

            return false;
        });
    }

    // =========================
    // Verify Todo Deleted
    // =========================

    public boolean isTodoDeleted(String todoText) {

        return wait.until(driver -> {

            List<WebElement> todos =
                    driver.findElements(todoItems);

            for (WebElement todo : todos) {

                if (todo.getText().contains(todoText)) {
                    return false;
                }
            }

            return true;
        });
    }

    // =========================
    // Empty State
    // =========================

    public boolean isNoTodosMessageDisplayed() {

        return wait.until(driver ->
                !driver.findElements(
                        noTodosMessage
                ).isEmpty()
        );
    }

    public boolean isTodoWithTextDisplayed(String todoText) {

        List<WebElement> todos = driver.findElements(todoItems);

        for (WebElement todo : todos) {

            if (todo.getText().trim().equals(todoText)) {
                return true;
            }
        }

        return false;
    }
}