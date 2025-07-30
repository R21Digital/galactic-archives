.PHONY: deps test

# Install Python dependencies
deps:
        pip install -r requirements.txt

# Install Node and Python dependencies then run all tests
test: deps
        npm install
        npm test
        pytest
