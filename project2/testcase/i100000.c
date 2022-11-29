#include <stdio.h>
int main() {
    int max = 100000;
    for (int i = 1; i <= max; ++i) {
        printf("i %d %d\n", i, i % 10);
    }
    printf("q\n");
    return 0;
}