import csv
import unittest
from pathlib import Path
from tempfile import NamedTemporaryFile

from show_names import read_names


class ReadNamesTests(unittest.TestCase):
    def test_reads_first_and_last_name_pairs(self):
        with NamedTemporaryFile(mode="w", suffix=".csv", delete=False, newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["id", "first_name", "last_name", "email", "gender", "ip_address"])
            writer.writerow(["1", "Ada", "Lovelace", "ada@example.com", "Female", "127.0.0.1"])
            writer.writerow(["2", "Alan", "Turing", "alan@example.com", "Male", "127.0.0.2"])
            path = Path(f.name)

        try:
            self.assertEqual(
                read_names(path),
                [("Ada", "Lovelace"), ("Alan", "Turing")],
            )
        finally:
            path.unlink()

    def test_reads_bundled_mock_data(self):
        csv_path = Path(__file__).parent.parent / "MOCK_DATA.csv"
        names = read_names(csv_path)
        self.assertEqual(len(names), 1000)
        self.assertEqual(names[0], ("Jolynn", "Attyeo"))


if __name__ == "__main__":
    unittest.main()
