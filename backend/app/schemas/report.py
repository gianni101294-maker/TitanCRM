from pydantic import BaseModel


class MonthlySalesItem(BaseModel):
    month: str
    value: float


class MonthlySalesResponse(BaseModel):
    year: int
    months: list[MonthlySalesItem]
