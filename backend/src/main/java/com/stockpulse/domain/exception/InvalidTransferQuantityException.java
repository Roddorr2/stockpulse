package com.stockpulse.domain.exception;

public class InvalidTransferQuantityException extends RuntimeException {

    public InvalidTransferQuantityException(String message) {
        super(message);
    }

}
