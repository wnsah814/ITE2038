#include <bits/stdc++.h>
using namespace std;

class name_grade {
	public:
		string student_name;
		int korean;
		int math;
		int english;
		int science;
		int social;
		int history;

		void set_grade(string tuple)
		{
			stringstream tuplestr(tuple);
			string tempstr;

			getline(tuplestr, student_name, ',');

			getline(tuplestr, tempstr, ',');
			korean = stoi(tempstr);
			
			getline(tuplestr, tempstr, ',');
			math = stoi(tempstr);
			
			getline(tuplestr, tempstr, ',');
			english = stoi(tempstr);
			
			getline(tuplestr, tempstr, ',');
			science = stoi(tempstr);
			
			getline(tuplestr, tempstr, ',');
			social = stoi(tempstr);
			
			getline(tuplestr, tempstr);
			history = stoi(tempstr);
		}
};

class name_number{
	public :
		string student_name;
		string student_number;

		void set_number(string tuple)
		{
			stringstream tuplestr(tuple);

			getline(tuplestr, student_name, ',');
			getline(tuplestr, student_number, ',');
		}
};

string make_tuple(string name, string number)
{
	string ret = "";

	ret += name+ "," + number +"\n";

	return ret;
}

int hash_string(string name) {
	int sum = 0;
	for (int i = 0; i < name.length(); ++i) {
		sum += int(name[i]);
	}
    return sum % 11;
}

int main(){

	string buffer[2];
	name_grade temp0;
	name_grade temp1;
	name_number temp2;
	fstream block[12];
	ofstream output;

	output.open("./output3.csv");

	if(output.fail())
	{
		cout << "output file opening fail.\n";
	}

	/*********************************************************************/

	// let's say name_grade1 r, name_grade2 s and name_number t
	
	int i; // iterator
	int cnt; // 성적 상승한 과목의 개수
	
	// r, s, t를 각각 해시함수를 적용해 버킷에 저장한다.
	// student_grade1(r)
	for (i = 0; i < 11; ++i) {
		block[i].open("./buckets/case3/grade_r" + to_string(i) + ".csv", fstream::out | fstream::trunc);
		if (block[i].fail()) cout << "cannot open file\n";
	}

	for (i = 0; i < 1000; ++i) {
		block[11].open("./name_grade1/" + to_string(i) + ".csv");
		while (getline(block[11], buffer[0])) {
			temp0.set_grade(buffer[0]);
			int res = hash_string(temp0.student_name);
			block[res] << temp0.student_name << ',' << temp0.korean << ',' << temp0.math << ',' << temp0.english << ',' << temp0.science << ',' << temp0.social << ',' << temp0.history << '\n';
		}
		block[11].close();
	}

	// student_grade2(s)
	for (i = 0; i < 11; ++i) {
		block[i].close();
		block[i].open("./buckets/case3/grade_s" + to_string(i) + ".csv", fstream::out | fstream::trunc);
		if (block[i].fail()) {
			cout << "cannot open file\n";
		}
	}

	for (i = 0; i < 1000; ++i) {
		block[11].open("./name_grade2/" + to_string(i) + ".csv");
		while (getline(block[11], buffer[1])) {
			temp1.set_grade(buffer[1]);
			int res = hash_string(temp1.student_name);
			block[res] << temp1.student_name << ',' << temp1.korean << ',' << temp1.math << ',' << temp1.english << ',' << temp1.science << ',' << temp1.social << ',' << temp1.history << '\n';
		}
		block[11].close();
	}

	// student_number(t)
	for (i = 0; i < 11; ++i) {
		block[i].close();
		block[i].open("./buckets/case3/number_t" + to_string(i) + ".csv", fstream::out | fstream::trunc);
		if (block[i].fail()) {
			cout << "cannot open file\n";
		}
	}

	for (i = 0; i < 1000; ++i) {
		block[11].open("./name_number/" + to_string(i) + ".csv");
		while (getline(block[11], buffer[0])) {
			temp2.set_number(buffer[0]);
			int res = hash_string(temp2.student_name);
			block[res] << temp2.student_name << ',' << temp2.student_number << '\n';
		}
		block[11].close();
	}

	for (i = 0; i < 11; ++i) {
		block[i].close();
	}
	// hashing done

	// grade bucket에서 조건(두 개 이상의 과목에서 성적 향상이 일어난 학생)을 만족하는 지 검사하여
	// 만족하는 경우 그 학생의 이름만 새로운 버킷에 저장한다.
	for (i = 0; i < 11;  ++i) {
		block[0].open("buckets/case3/grade_r" + to_string(i) + ".csv");
		if (block[0].fail()) cout << "cannot open file\n";
		block[1].open("buckets/case3/grade_s" + to_string(i) + ".csv");
		if (block[1].fail()) cout << "cannot open file\n";
		block[2].open("./buckets/case3/name" + to_string(i) + ".csv", fstream::out | fstream::trunc);
		if (block[2].fail()) cout << "cannot open file\n";

		while (getline(block[0], buffer[0])) {
			temp0.set_grade(buffer[0]);
			block[1].seekg(ios::beg);
			while (getline(block[1], buffer[1])) {
				temp1.set_grade(buffer[1]);
				if (temp0.student_name == temp1.student_name) {
					cnt = 0;
					if (temp0.korean > temp1.korean) cnt++;
					if (temp0.math > temp1.math) cnt++;
					if (temp0.english > temp1.english) cnt++;
					if (temp0.science > temp1.science) cnt++;
					if (temp0.social > temp1.social) cnt++;
					if (temp0.history > temp1.history) cnt++;
					if (cnt >= 2) {
						block[2] << temp0.student_name << '\n';
					}
					break;
				}
			}
		}
		block[0].close();
		block[1].close();
		block[2].close();
	}

	// student_name을 outer로, (student_name,student_id)를 inner로 같는 join을 진행한다
	for (i = 0; i < 11; ++i) {
		block[0].open("buckets/case3/name" + to_string(i) + ".csv");
		if (block[1].fail()) cout << "cannot open file#6\n";
		
		block[1].open("buckets/case3/number_t" + to_string(i) + ".csv");
		if (block[0].fail()) cout << "cannot open file#5\n";

		while (getline(block[0], buffer[0])) {
			block[1].seekg(ios::beg);
			while (getline(block[1], buffer[1])) {
				temp2.set_number(buffer[1]);
				if (temp2.student_name == buffer[0]) {
					output << make_tuple(temp2.student_name, temp2.student_number);
					// output << temp2.student_name << ',' << temp2.student_number << '\n';
					break;
				}
			}
		}
		block[0].close();
		block[1].close();
	}

	// 아래 구현은 (student_name, student_number)가 outer, (student_name)이 inner로 설정해 만족하는 지를 확인한다.
	// 이렇게 구현했던 이유는 student_name만 있는 버킷이 상대적으로 크기가 작기 때문이다.
	// 하지만 outer의 student_name이 inner에 없을 수 있으므로 inner가 끝까지 getline을 실행한다.
	// 이렇게 되면 seekg를 사용할 수 없어서 조금의 시간복잡도가 증가하지만 inner와 outer의 순서를 바꿔서 진행하였다.

	// for (i = 0; i < 11; ++i) {
	// 	block[0].open("buckets/case3/number_t" + to_string(i) + ".csv");
	// 	if (block[0].fail()) cout << "cannot open file#5\n";

	// 	while (getline(block[0], buffer[0])) {
	// 		temp2.set_number(buffer[0]);
	// 		block[1].open("buckets/case3/name" + to_string(i) + ".csv");
	// 		if (block[1].fail()) cout << "cannot open file#6\n";
			
	// 		while (getline(block[1], buffer[1])) {
	// 			if (temp2.student_name == buffer[1]) {
	// 				output << temp2.student_name << ',' << temp2.student_number << '\n';
	// 				break;
	// 			}
	// 		}
	// 		block[1].close();
	// 	}

	// 	block[0].close();
	// 	block[1].close();
	// }

	/*********************************************************************/


	output.close();

	
}
