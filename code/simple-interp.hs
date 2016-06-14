data Term = Constant Int
          | Plus Term Term
          | Mult Term Term

term1 = Plus (Constant 2) (Mult (Constant 5) (Constant 3))

eval :: Term -> Int
eval (Constant n) = n
eval (Plus t1 t2) = eval t1 + eval t2
eval (Mult t1 t2) = eval t1 * eval t2

pp :: Term -> String
pp (Constant n) = show n
pp (Plus t1 t2) = pp t1 ++ " + " ++ pp t2
pp (Mult t1 t2) = pp t1 ++ " * " ++ pp t2
