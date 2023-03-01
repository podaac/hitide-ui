import json
import os
import argparse

def parse_args():
    """
    Parses the program arguments
    Returns
    -------
    args
    """

    parser = argparse.ArgumentParser(
        description='Convert list collection to a file',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument('-e', '--env',
                        help='CMR environment used to pull results from.',
                        required=True,
                        choices=["uat", "ops"],
                        metavar='uat or ops')

    parser.add_argument('-i', '--input_file',
                        help='File of json collections',
                        required=True,
                        metavar='')

    parser.add_argument('-o', '--output_path',
                        help='output path for success and fails',
                        required=True,
                        metavar='')

    args = parser.parse_args()
    return args

def run():
    """
    Run from command line.

    Returns
    -------
    """

    _args = parse_args()

    input_file = _args.input_file
    environment = _args.env

    with open(_args.input_file) as json_data:
        try:
            collections = json.load(json_data)
        except ValueError:
            collections = []
            json_data.seek(0)
            lines = json_data.readlines()
            for line in lines:
                collections.append(line.strip())

    venue = "prod"
    if environment == "uat":
        venue = "uat"

    if _args.output_path:
        success_outfile = f'{_args.output_path}/{_args.env}_success.txt'

        with open(success_outfile, 'w') as the_file:
            the_file.writelines(x + '\n' for x in collections)

if __name__ == '__main__':
    run()