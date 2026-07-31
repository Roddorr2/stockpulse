package com.stockpulse.domain.exception;

public class SameBranchTransferException extends RuntimeException {

    public SameBranchTransferException(String message) {
        super(message);
    }

}
