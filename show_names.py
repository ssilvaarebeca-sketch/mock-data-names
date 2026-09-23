import argparse
import csv
from pathlib import Path


def read_names(csv_path):
    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        return [(row["first_name"], row["last_name"]) for row in reader]


def main():
    parser = argparse.ArgumentParser(description="Print first and last names from a CSV file.")
    parser.add_argument(
        "--csv",
        type=Path,
        default=Path(__file__).parent / "MOCK_DATA.csv",
        help="Path to the CSV file (default: MOCK_DATA.csv next to this script)",
    )
    args = parser.parse_args()

    for first_name, last_name in read_names(args.csv):
        print(first_name, last_name)


if __name__ == "__main__":
    main()
